# Generated by Django 4.0.5 on 2022-07-23 19:07

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('django_celery_beat', '0016_alter_crontabschedule_timezone'),
        ('Devices', '0008_timeaction'),
    ]

    operations = [
        migrations.AlterField(
            model_name='timeaction',
            name='crontab',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='django_celery_beat.crontabschedule'),
        ),
    ]