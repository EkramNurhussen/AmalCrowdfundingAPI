from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile

class UserSerializer(serializers.ModelSerializer):
    is_creator = serializers.BooleanField(default=False)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'is_creator']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        is_creator = validated_data.pop('is_creator', False)
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        Profile.objects.create(user=user, is_creator=is_creator)
        return user

class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = Profile
        fields = ['username', 'email', 'bio', 'is_creator']