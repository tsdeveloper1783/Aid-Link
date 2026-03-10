import datetime
from textblob import TextBlob


def donor_level_score(level):
    if level == "high":
        return 30
    if level == "medium":
        return 20
    return 10  # low


def category_match(recipient_cat, donor_cat):
    return 20 if recipient_cat == donor_cat else 5


def document_severity(recipient):
    score = 0

    # Education severity
    if recipient.category == "education" and recipient.fee_last_date:
        days_left = (recipient.fee_last_date - datetime.date.today()).days
        if days_left <= 2:
            score += 30
        elif days_left <= 7:
            score += 20
        else:
            score += 10

    # Medical severity
    if recipient.category == "medical":
        report = (recipient.medical_report or "").lower()
        if "icu" in report:
            score += 35
        elif "critical" in report:
            score += 25
        elif "surgery" in report:
            score += 20
        else:
            score += 10

    # Food severity
    if recipient.category == "food":
        if recipient.family_members > 6:
            score += 20
        else:
            score += 10

    # Orphan severity
    if recipient.category == "orphan":
        if recipient.children_count > 3:
            score += 25
        else:
            score += 15

    return score


# DESCRIPTION ANALYSIS (NLP + Sentiment + Category Keywords)




def description_analysis(text, category):
    text = text.lower()
    high_keywords = {
        "education": ["urgent", "immediate", "fee due", "school fees", "tuition", "deadline"],
        "medical": ["icu", "critical", "emergency", "surgery", "life-threatening"],
        "food": ["starving", "hungry", "no food", "family starving", "food crisis"],
        "orphan": ["urgent", "no guardian", "abandoned", "emergency", "no family"]
    }

    medium_keywords = {
        "education": ["help", "support", "books", "tuition fee"],
        "medical": ["treatment", "doctor", "checkup", "medication"],
        "food": ["meal", "groceries", "daily food"],
        "orphan": ["help", "care", "school", "books"]
    }

    low_keywords = {
        "education": ["information", "query", "minor help"],
        "medical": ["information", "mild illness"],
        "food": ["information", "help request"],
        "orphan": ["information", "question"]
    }
    high_list = high_keywords.get(category, [])
    medium_list = medium_keywords.get(category, [])
    low_list = low_keywords.get(category, [])

    # Keyword score
    if any(k in text for k in high_list):
        keyword_score = 25
    elif any(k in text for k in medium_list):
        keyword_score = 15
    elif any(k in text for k in low_list):
        keyword_score = 10
    else:
        keyword_score = 5

    # Sentiment score
    blob = TextBlob(text)
    polarity = blob.sentiment.polarity

    if polarity < -0.3:
        sentiment_score = 25
    elif polarity < 0:
        sentiment_score = 20
    elif polarity <= 0.3:
        sentiment_score = 15
    else:
        sentiment_score = 5

    # Final description score
    return int(0.5 * keyword_score + 0.5 * sentiment_score)


def need_urgency(urgency):
    if urgency == "high":
        return 20
    if urgency == "medium":
        return 10
    return 5



# FINAL AI SCORE


def calculate_final_score(recipient, donor_preferences):
    score = 0
    score += donor_level_score(donor_preferences.level)
    score += category_match(recipient.category, donor_preferences.category)
    score += document_severity(recipient)
    score += description_analysis(recipient.description, recipient.category)
    score += need_urgency(recipient.urgency)
    return min(score, 100)


def score_to_level(score):
    if score >= 70:
        return "high"
    elif score >= 40:
        return "medium"
    return "low"
