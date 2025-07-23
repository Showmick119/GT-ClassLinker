from rest_framework import viewsets
from .models import Class, User
from .serializers import ClassSerializer, UserSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action


class ClassViewSet(viewsets.ModelViewSet):
    queryset = Class.objects.all()
    serializer_class = ClassSerializer

    @action(detail=False, methods=['delete'])
    def delete_everything(self, request, pk=None):
        Class.objects.all().delete()
        return Response({"message": "All users have been deleted."}, status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['post'])
    def add_class(self, request, pk=None):
        required_fields = [
            "class_name", "class_name_long", "room", "description",
            "crn", "days", "time", "instructor", "section"]
        missing_fields = [field for field in required_fields if field not in request.data]

        if missing_fields:
            return Response(
                {"error": f"Missing required fields: {', '.join(missing_fields)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        data = {
            "course_id": request.data["class_name"],
            "course_name": request.data["class_name_long"],
            "description": request.data["description"],
            "crn": request.data["crn"],
            "days": request.data["days"],
            "time": request.data["time"],
            "instructor": request.data["instructor"],
            "room": request.data["room"],
            "section": request.data["section"]
        }

        serializer = ClassSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['delete'])
    def delete_class(self, request, pk=None):
        if "crn" not in request.data and "id" not in request.data:
            return Response(
                {"error": "Missing required fields: crn or row id"},
                status=status.HTTP_400_BAD_REQUEST)
        crn = request.data.get('crn')
        id = request.data.get('id')
        if crn:
            try:
                class_instance = Class.objects.get(crn=crn)
                class_instance.delete()
                return Response({"message": f"Class with CRN {crn} deleted successfully."}, status=status.HTTP_200_OK)
            except Class.DoesNotExist:
                return Response({"error": f"Class with CRN {crn} not found."}, status=status.HTTP_404_NOT_FOUND)
        else:
            try:
                class_instance = Class.objects.get(id=id)
                class_instance.delete()
                return Response({"message": f"Class with id {id} deleted successfully."}, status=status.HTTP_200_OK)
            except Class.DoesNotExist:
                return Response({"error": f"Class with id {id} not found."}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['get'])
    def get_users_in_class(self, request, pk=None):
        crn = request.query_params.get("crn")
        if not crn:
            return Response(
                {"error": "Missing required field: crn"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            class_instance = Class.objects.get(crn=crn)
            users = class_instance.students.all()
            user_data = [{"first_name": user.first_name, "last_name": user.last_name, "roster": user.roster} for user in users]
            return Response({"class": class_instance.crn, "users": user_data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    @action(detail=False, methods=['post'])
    def create_user(self, request, pk=None):
        required_fields = ["first_name", "last_name", "roster"]
        missing_fields = [field for field in required_fields if field not in request.data]

        if missing_fields:
            return Response(
                {"error": f"Missing required fields: {', '.join(missing_fields)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        existing_user = User.objects.filter(roster=request.data["roster"]).first()
        if existing_user:
            return Response({"message": "User already exists.", "user": UserSerializer(existing_user).data}, status=status.HTTP_200_OK)

        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def add_classes_to_user(self, request, pk=None):
        required_fields = ["crn_list", "roster"]
        missing_fields = [field for field in required_fields if field not in request.data]
        if missing_fields:
            return Response(
                {"error": f"Missing required fields: {', '.join(missing_fields)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = User.objects.get(roster=request.data["roster"])
        except User.DoesNotExist:
            return Response({"error": f"User with roster {request.data['roster']} not found."}, status=status.HTTP_404_NOT_FOUND)

        crn_arr = request.data["crn_list"]
        for crn in crn_arr:
            try:
                class_instance = Class.objects.get(crn=crn)
                user.classes.add(class_instance)
            except Class.DoesNotExist:
                return Response({"error": f"Course with crn {crn} not found."}, status=status.HTTP_404_NOT_FOUND)

        return Response(status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'])
    def does_user_exist(self, request, pk=None):
        roster = request.query_params.get("roster")
        if not roster:
            return Response({"error": "Missing required field: roster"}, status=status.HTTP_400_BAD_REQUEST)
        exists = User.objects.filter(roster=roster).exists()
        return Response({"userExists": exists}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'])
    def get_user_classes(self, request, pk=None):
        roster = request.query_params.get("roster")
        if not roster:
            return Response({"error": "Missing required field: roster"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            user = User.objects.get(roster=roster)
        except User.DoesNotExist:
            return Response({"error": f"User with roster {roster} not found."}, status=status.HTTP_404_NOT_FOUND)

        try:
            classes = user.classes.all()
            class_data = [
                {
                    "crn": cls.crn,
                    "course_id": cls.course_id,
                    "course_name_long": cls.course_name,
                    "description": cls.description,
                    "instructor": cls.instructor,
                    "days": cls.days,
                    "time": cls.time,
                    "room": cls.room,
                    "section": cls.section,
                }
                for cls in classes
            ]
            return Response({"user": f"{user.first_name} {user.last_name}", "classes": class_data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['delete'])
    def delete_user_classes(self, request, pk=None):
        required_fields = ["crn_list", "roster"]
        missing_fields = [field for field in required_fields if field not in request.data]
        if missing_fields:
            return Response(
                {"error": f"Missing required fields: {', '.join(missing_fields)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = User.objects.get(roster=request.data["roster"])
        except User.DoesNotExist:
            return Response({"error": f"User with roster {request.data['roster']} not found."}, status=status.HTTP_404_NOT_FOUND)

        crn_arr = request.data["crn_list"]
        crns_removed = []
        failed_to_remove = []
        for crn in crn_arr:
            try:
                class_instance = Class.objects.get(crn=crn)
                user.classes.remove(class_instance)
                crns_removed.append(crn)
            except Class.DoesNotExist:
                failed_to_remove.append(crn)
        data = {
            "removed": crns_removed,
            "failed": failed_to_remove
        }
        return Response(data, status=status.HTTP_200_OK)
