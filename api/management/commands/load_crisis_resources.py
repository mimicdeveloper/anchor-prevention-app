from django.core.management.base import BaseCommand
from api.models import CrisisResource

class Command(BaseCommand):
    help = 'Load predefined crisis resources'

    def handle(self, *args, **kwargs):
        resources = [
            {
                'name': '988 Suicide & Crisis Lifeline',
                'description': 'Free, confidential support for people in distress, prevention and crisis resources.',
                'phone': '988',
                'website': 'https://988lifeline.org',
            },
            {
                'name': 'SAMHSA National Helpline',
                'description': 'Free treatment referral and information service for mental health or substance use disorders.',
                'phone': '1-800-662-HELP (4357)',
                'website': 'https://www.samhsa.gov/find-help/national-helpline',
            },
            {
                'name': 'Crisis Text Line',
                'description': 'Free 24/7 support via text message for people in crisis.',
                'phone': 'Text HELLO to 741741',
                'website': 'https://www.crisistextline.org',
            },
            {
                'name': 'National Domestic Violence Hotline',
                'description': 'Support for survivors of domestic violence, available 24/7.',
                'phone': '1-800-799-SAFE (7233)',
                'website': 'https://www.thehotline.org',
            },
            {
                'name': 'The Trevor Project',
                'description': 'Crisis support for LGBTQ+ youth, via chat, text, or phone.',
                'phone': '1-866-488-7386',
                'website': 'https://www.thetrevorproject.org',
            },
            {
                'name': 'Veterans Crisis Line',
                'description': 'Help for U.S. military veterans, service members, and families.',
                'phone': '988 then press 1',
                'website': 'https://www.veteranscrisisline.net',
            },
            {
                'name': 'NAMI HelpLine',
                'description': 'Mental health resource line by National Alliance on Mental Illness.',
                'phone': '1-800-950-NAMI (6264)',
                'website': 'https://www.nami.org/help',
            },
        ]

        for res in resources:
            CrisisResource.objects.get_or_create(**res)

        self.stdout.write(self.style.SUCCESS('Crisis resources loaded successfully.'))
