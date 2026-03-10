#include<iostream>
using namespace std;

class Array {
private:
    int totalSize;
    int usedSize;
    int* arr;

public:
    Array(int tSize) {
        totalSize = tSize;
        usedSize = 0;
        arr = new int[totalSize];
    }

    void traversing() {
        for (int i = 0; i < usedSize; i++) {
            cout << arr[i] << "  ";
        }
        cout << endl;
    }

    int push(int element) {
        if (usedSize == totalSize) {
            return -1;
        }
        arr[usedSize] = element;
        usedSize++;
        return 1;
    }

    int pop() {
        if (usedSize == 0) {
            return -1;
        }
        usedSize--;
        return 1;
    }

    ~Array() {
        delete[] arr;
    }
};

int main() {
    Array obj(5);
  cout<<"\nPush  the elments\n";
    obj.push(10);
    obj.push(20);
    obj.push(30);
    obj.push(40);

    obj.traversing();
  cout<<"\nPop  the elments\n";

    obj.pop();
    obj.traversing();

    return 0;
}

