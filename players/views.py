from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import Task
from .serializers import TaskSerializer


@api_view(['GET', 'POST'])
def task_list(request):

    if request.method == 'GET':
        tasks = Task.objects.all().order_by('-created_at')
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = TaskSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def delete_task(request, pk):

    try:
        task = Task.objects.get(id=pk)

    except Task.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    task.delete()

    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['PATCH'])
def toggle_task(request, pk):

    try:
        task = Task.objects.get(id=pk)

    except Task.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    task.completed = not task.completed
    task.save()

    serializer = TaskSerializer(task)

    return Response(serializer.data)