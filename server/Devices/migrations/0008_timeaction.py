# Generated by Django 4.0.5 on 2022-07-23 17:48

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('django_celery_beat', '0016_alter_crontabschedule_timezone'),
        ('Devices', '0007_alter_pinofdevice_device'),
    ]

    operations = [
        migrations.CreateModel(
            name='TimeAction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('enable', models.BooleanField(default=True)),
                ('crontab', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='django_celery_beat.crontabschedule')),
                ('relay', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Devices.relayfordevice')),
            ],
        ),
    ]
