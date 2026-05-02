// lib/utils.ts
import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export const TASK_TYPE_LABELS: Record<string, string> = {
  SURVEY: 'Survey',
  REDDIT_POST: 'Reddit Post',
  REDDIT_UPVOTE: 'Reddit Upvote',
  DATA_COLLECTION: 'Data Collection',
  SOCIAL_MEDIA: 'Social Media',
  APP_REVIEW: 'App Review',
  CONTENT_WRITING: 'Content Writing',
}

export const TASK_TYPE_COLORS: Record<string, string> = {
  SURVEY: 'bg-blue-100 text-blue-800',
  REDDIT_POST: 'bg-orange-100 text-orange-800',
  REDDIT_UPVOTE: 'bg-orange-100 text-orange-800',
  DATA_COLLECTION: 'bg-purple-100 text-purple-800',
  SOCIAL_MEDIA: 'bg-pink-100 text-pink-800',
  APP_REVIEW: 'bg-green-100 text-green-800',
  CONTENT_WRITING: 'bg-yellow-100 text-yellow-800',
}

export const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
  ACTIVE: 'bg-green-100 text-green-800',
  PAUSED: 'bg-yellow-100 text-yellow-800',
  COMPLETED: 'bg-gray-100 text-gray-700',
}
