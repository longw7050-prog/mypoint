/**
 * types/index.ts - TypeScript 类型定义
 * 
 * 【作用】
 * 定义应用中所有数据结构的类型，包括：
 * - Child: 孩子信息
 * - PointRecord: 积分记录
 * - Reward: 可兑换奖励
 * - PointCategory: 积分类别
 * 
 * 【包含默认值】
 * - DEFAULT_EARN_CATEGORIES: 预设获得类别
 * - DEFAULT_SPEND_CATEGORIES: 预设消费类别
 * 
 * 【被引用】
 * - 所有使用这些类型的文件都会引用此文件
 */

export interface Child {
  id: string;
  name: string;
  avatar?: string;
  age: number;
  totalPoints: number;
  createdAt: string;
}

export interface PointRecord {
  id: string;
  childId: string;
  type: 'earn' | 'spend';
  amount: number;
  reason: string;
  date: string;
  createdAt: string;
}

export interface Reward {
  id: string;
  name: string;
  points: number;
  icon?: string;
}

export interface PointCategory {
  id: string;
  name: string;
  points: number;
  icon: string;
  type: 'earn' | 'spend';
}

export const DEFAULT_EARN_CATEGORIES: PointCategory[] = [
  { id: 'ec-1', name: '小红花奖励', points: 2, icon: '🌸', type: 'earn' },
  { id: 'ec-2', name: '帮助做家务', points: 5, icon: '🧹', type: 'earn' },
  { id: 'ec-3', name: '考试成绩优秀', points: 10, icon: '⭐', type: 'earn' },
  { id: 'ec-4', name: '主动学习', points: 8, icon: '📚', type: 'earn' },
  { id: 'ec-5', name: '照顾弟妹', points: 6, icon: '❤️', type: 'earn' },
];

export const DEFAULT_SPEND_CATEGORIES: PointCategory[] = [
  { id: 'sc-1', name: '购买玩具', points: 50, icon: '🧸', type: 'spend' },
  { id: 'sc-2', name: '出去玩', points: 30, icon: '🎢', type: 'spend' },
  { id: 'sc-3', name: '看电视时间', points: 10, icon: '📺', type: 'spend' },
  { id: 'sc-4', name: '买零食', points: 5, icon: '🍭', type: 'spend' },
  { id: 'sc-5', name: '游戏时间', points: 15, icon: '🎮', type: 'spend' },
];
