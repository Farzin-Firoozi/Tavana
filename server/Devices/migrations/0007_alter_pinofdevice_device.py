# Generated by Django 4.0.5 on 2022-07-23 11:56

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('Devices', '0006_alter_operators_unique_together'),
    ]

    operations = [
        migrations.AlterField(
            model_name='pinofdevice',
            name='device',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='Devices.device'),
        ),
    ]
