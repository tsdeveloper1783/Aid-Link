from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from .models import Note
from .serializers import NoteSerializer, UserSerializer
from django.shortcuts import get_object_or_404

@api_view(['GET'])
def getRoutes(request):
    routes = [
        {'endpoint': '/notes/', 'method': 'GET', 'body': None, 'description': 'Returns user’s notes'},
        {'endpoint': '/notes/create/', 'method': 'POST', 'body': {'title': "", 'content': ""}, 'description': 'Create new note'},
        {'endpoint': '/notes/<id>/', 'method': 'GET', 'body': None, 'description': 'Get single note'},
        {'endpoint': '/notes/update/<id>/', 'method': 'PUT', 'body': {'title': "", 'content': ""}, 'description': 'Update note'},
        {'endpoint': '/notes/delete/<id>/', 'method': 'DELETE', 'body': None, 'description': 'Delete note'},
        {'endpoint': '/register/', 'method': 'POST', 'body': {'username':'', 'password':''}, 'description':'Create new user'},
        {'endpoint': '/token/', 'method': 'POST', 'body': {'username':'', 'password':''}, 'description': 'Get JWT tokens'},
    ]
    return Response(routes)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getNotes(request):
    notes = Note.objects.filter(user=request.user).order_by('-created_at')
    serializer = NoteSerializer(notes, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getNote(request, pk):
    note = get_object_or_404(Note, id=pk, user=request.user)
    serializer = NoteSerializer(note, many=False)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createNote(request):
    data = request.data
    serializer = NoteSerializer(data=data)
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateNote(request, pk):
    note = get_object_or_404(Note, id=pk, user=request.user)
    serializer = NoteSerializer(note, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def deleteNote(request, pk):
    note = get_object_or_404(Note, id=pk, user=request.user)
    note.delete()
    return Response({'detail': 'Note deleted'}, status=status.HTTP_204_NO_CONTENT)

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({'id': user.id, 'username': user.username}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
