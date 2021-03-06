from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import Post
from .serializers import *

# Create your views here.
@api_view(['GET', 'POST', 'DELETE'])
def posts(request):
    if request.method == 'GET':
        posts = Post.objects.all()
        serializer = PostSerializer(posts, many = True)
        return Response({'data': serializer.data})
    elif request.method == 'POST':
        post = Post()
        post.text = request.data['text']
        post.save()
        return Response(status = status.HTTP_200_OK)
    elif request.method == 'DELETE':
        instance = Post.objects.get(id=request.data['id'])
        instance.delete()
        return Response(status = status.HTTP_200_OK)


@api_view(['GET'])
def like_posts(request, post_id):
    if request.method == 'GET':
        try:
            post = Post.objects.get(id=post_id)
        except:
            return Response(status = status.HTTP_400_BAD_REQUEST)
        post.likesCount += 1
        post.save()
        return Response(post.likesCount, status.HTTP_200_OK)
