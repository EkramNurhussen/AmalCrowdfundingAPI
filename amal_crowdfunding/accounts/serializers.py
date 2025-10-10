# accounts/serializers.py
from rest_framework import serializers
from django.contrib.auth import get_user_model

CustomUser = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'is_creator', 'bio', 'profile_picture']
        read_only_fields = ['id']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password', 'is_creator', 'bio', 'profile_picture']

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            is_creator=validated_data.get('is_creator', False),
            bio=validated_data.get('bio', ''),
        )
        return user