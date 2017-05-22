from django.db import models

class item(models.Model):
    author = models.ForeignKey('auth.User')
    title = models.CharField(max_length=200)
    day = models.CharField(max_length=200)

    def __str__(self):
        return self.title
