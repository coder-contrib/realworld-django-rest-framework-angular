#!/usr/bin/env python3
"""
RealWorld Sample Data Seeder
Creates sample users, articles, tags and comments for development
"""

import os
import sys
import django

# Add the backend directory to Python path
sys.path.append('backend')

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from articles.models import Article, Tag, Comment

User = get_user_model()

def create_sample_data():
    print("🌱 Seeding database with sample data...")
    
    # Create sample users
    print("Creating users...")
    users_data = [
        {
            'username': 'alice',
            'email': 'alice@realworld.io',
            'bio': 'Full-stack developer passionate about clean code and modern web technologies.',
        },
        {
            'username': 'bob',
            'email': 'bob@realworld.io', 
            'bio': 'Tech enthusiast and blogger sharing insights about software development.',
        },
        {
            'username': 'charlie',
            'email': 'charlie@realworld.io',
            'bio': 'Frontend developer focused on React and Angular frameworks.',
        }
    ]
    
    created_users = []
    for user_data in users_data:
        user, created = User.objects.get_or_create(
            email=user_data['email'],
            defaults={
                'username': user_data['username'],
                'bio': user_data['bio'],
            }
        )
        if created:
            user.set_password('password123')
            user.save()
            print(f"  ✅ Created user: {user.username}")
        else:
            print(f"  ⚪ User exists: {user.username}")
        created_users.append(user)
    
    # Create sample tags
    print("Creating tags...")
    tag_names = ['python', 'django', 'angular', 'javascript', 'webdev', 'tutorial', 'beginners', 'productivity']
    created_tags = []
    for tag_name in tag_names:
        tag, created = Tag.objects.get_or_create(name=tag_name)
        if created:
            print(f"  ✅ Created tag: {tag.name}")
        else:
            print(f"  ⚪ Tag exists: {tag.name}")
        created_tags.append(tag)
    
    # Create sample articles
    print("Creating articles...")
    articles_data = [
        {
            'title': 'Getting Started with Django REST Framework',
            'description': 'A comprehensive guide to building APIs with Django REST Framework',
            'body': '''# Getting Started with Django REST Framework

Django REST Framework (DRF) is a powerful toolkit for building Web APIs in Django. In this tutorial, we'll explore the fundamentals of creating a RESTful API.

## Installation

First, install Django REST Framework:

```bash
pip install djangorestframework
```

## Basic Serializer

Create a serializer to handle data conversion:

```python
from rest_framework import serializers

class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = '__all__'
```

## ViewSets

ViewSets provide the logic for handling requests:

```python
from rest_framework import viewsets

class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
```

This gives you a full CRUD API with minimal code!''',
            'author': created_users[0],
            'tags': ['python', 'django', 'tutorial']
        },
        {
            'title': 'Angular Best Practices for Large Applications',
            'description': 'Essential patterns and practices for scaling Angular applications',
            'body': '''# Angular Best Practices for Large Applications

Building large-scale Angular applications requires careful planning and adherence to best practices.

## Project Structure

Organize your project with feature modules:

```
src/
  app/
    core/
    shared/
    features/
      user/
      articles/
```

## State Management

For complex state, consider NgRx:

```typescript
import { Store } from '@ngrx/store';

@Component({...})
export class ArticleComponent {
  constructor(private store: Store) {}
  
  loadArticles() {
    this.store.dispatch(loadArticles());
  }
}
```

## Performance Tips

- Use OnPush change detection
- Lazy load feature modules  
- Implement virtual scrolling for large lists
- Use trackBy functions in *ngFor''',
            'author': created_users[1],
            'tags': ['angular', 'javascript', 'webdev']
        },
        {
            'title': 'Building Modern Web Applications',
            'description': 'Exploring the full-stack development with Django and Angular',
            'body': '''# Building Modern Web Applications

Modern web development combines powerful backend frameworks with rich frontend experiences.

## Backend with Django

Django provides:
- Robust ORM
- Built-in admin interface
- Comprehensive security features
- Scalable architecture

## Frontend with Angular

Angular offers:
- Component-based architecture
- TypeScript support
- Powerful CLI tools
- Rich ecosystem

## Integration

Connect them through REST APIs:

```python
# Django
@api_view(['GET'])
def article_list(request):
    articles = Article.objects.all()
    serializer = ArticleSerializer(articles, many=True)
    return Response(serializer.data)
```

```typescript
// Angular
getArticles(): Observable<Article[]> {
  return this.http.get<Article[]>('/api/articles/');
}
```''',
            'author': created_users[2],
            'tags': ['python', 'django', 'angular', 'webdev']
        },
        {
            'title': 'JavaScript Tips for Better Code',
            'description': 'Essential JavaScript techniques every developer should know',
            'body': '''# JavaScript Tips for Better Code

Improve your JavaScript skills with these essential techniques.

## Modern Syntax

Use destructuring and spread operators:

```javascript
// Destructuring
const { name, email } = user;

// Spread operator
const newUser = { ...user, isActive: true };
```

## Async/Await

Handle promises elegantly:

```javascript
async function fetchArticles() {
  try {
    const response = await fetch('/api/articles');
    const articles = await response.json();
    return articles;
  } catch (error) {
    console.error('Error:', error);
  }
}
```

## Array Methods

Master functional array methods:

```javascript
const publishedArticles = articles
  .filter(article => article.published)
  .map(article => ({
    ...article,
    excerpt: article.body.substring(0, 100)
  }));
```''',
            'author': created_users[0],
            'tags': ['javascript', 'webdev', 'beginners']
        },
        {
            'title': 'Productivity Tips for Developers',
            'description': 'Boost your development productivity with these proven strategies',
            'body': '''# Productivity Tips for Developers

Maximize your development efficiency with these practical tips.

## IDE Setup

Configure your development environment:
- Use code snippets
- Set up keyboard shortcuts
- Install useful extensions
- Customize themes for comfort

## Version Control

Git best practices:
- Write meaningful commit messages
- Use feature branches
- Review code before merging
- Keep commits atomic

## Time Management

Effective development habits:
- Use the Pomodoro Technique
- Break large tasks into smaller ones
- Eliminate distractions
- Take regular breaks

## Documentation

Document as you code:
- Write clear README files
- Comment complex logic
- Maintain API documentation
- Create usage examples''',
            'author': created_users[1],
            'tags': ['productivity', 'webdev']
        }
    ]
    
    created_articles = []
    for article_data in articles_data:
        # Extract tags from article data
        tag_names = article_data.pop('tags', [])
        
        # Create or get article
        article, created = Article.objects.get_or_create(
            title=article_data['title'],
            defaults=article_data
        )
        
        if created:
            # Add tags to article
            for tag_name in tag_names:
                tag = Tag.objects.get(name=tag_name)
                article.tag_list.add(tag)
            print(f"  ✅ Created article: {article.title}")
        else:
            print(f"  ⚪ Article exists: {article.title}")
        created_articles.append(article)
    
    # Create sample comments
    print("Creating comments...")
    comments_data = [
        {
            'article': created_articles[0],
            'author': created_users[1],
            'body': 'Great tutorial! This really helped me understand DRF better.'
        },
        {
            'article': created_articles[0], 
            'author': created_users[2],
            'body': 'Thanks for sharing. The code examples are very clear.'
        },
        {
            'article': created_articles[1],
            'author': created_users[0],
            'body': 'Excellent points about project structure. I\'ll definitely apply these patterns.'
        },
        {
            'article': created_articles[2],
            'author': created_users[1],
            'body': 'Nice overview of full-stack development. The integration examples are helpful.'
        }
    ]
    
    for comment_data in comments_data:
        comment, created = Comment.objects.get_or_create(
            article=comment_data['article'],
            author=comment_data['author'],
            body=comment_data['body']
        )
        if created:
            print(f"  ✅ Created comment on: {comment.article.title}")
        else:
            print(f"  ⚪ Comment exists on: {comment.article.title}")
    
    # Create some follow relationships
    print("Creating follow relationships...")
    created_users[0].following.add(created_users[1])
    created_users[1].following.add(created_users[2])
    created_users[2].following.add(created_users[0])
    
    # Add some favorites
    print("Adding article favorites...")
    created_users[1].favorite_articles.add(created_articles[0])
    created_users[2].favorite_articles.add(created_articles[0], created_articles[1])
    created_users[0].favorite_articles.add(created_articles[2])
    
    print("✅ Database seeding completed!")
    print(f"Created {User.objects.count()} users, {Article.objects.count()} articles, {Tag.objects.count()} tags, {Comment.objects.count()} comments")

if __name__ == '__main__':
    create_sample_data()