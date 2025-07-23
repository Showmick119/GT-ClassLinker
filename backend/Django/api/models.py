from django.db import models

class Class(models.Model):
    course_id = models.CharField(max_length=100)
    course_name = models.CharField(max_length=100)
    crn = models.CharField(max_length=100)
    instructor = models.CharField(max_length=100)
    room = models.CharField(max_length=100)
    time = models.CharField(max_length = 100)
    days = models.CharField(max_length = 100)
    section = models.CharField(max_length = 100)
    description = models.CharField(max_length = 1000)

    def __str__(self):
        return self.crn

class User(models.Model):
    roster = models.CharField(max_length=100)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    classes = models.ManyToManyField(Class, related_name="students")

    def __str__(self):
        return self.name