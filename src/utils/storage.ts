import { Child, PointRecord, Reward, PointCategory } from '../types';

/**
 * storage.ts - 本地存储工具
 * 
 * 【作用】
 * 封装 localStorage 操作，提供数据的持久化和读取
 * 使用 JSON 序列化存储，支持四种数据类型
 * 
 * 【存储键】
 * - mypoint_children: 孩子列表
 * - mypoint_records: 积分记录列表
 * - mypoint_rewards: 可兑换奖励列表
 * - mypoint_categories: 积分类别列表
 * 
 * 【依赖】
 * - types/index.ts: 类型定义
 * 
 * 【被调用】
 * - store/useStore.ts: 状态初始化和数据变更时
 */

const STORAGE_KEYS = {
  CHILDREN: 'mypoint_children',
  RECORDS: 'mypoint_records',
  REWARDS: 'mypoint_rewards',
  CATEGORIES: 'mypoint_categories',
};

export const storage = {
  getChildren: (): Child[] => {
    const data = localStorage.getItem(STORAGE_KEYS.CHILDREN);
    return data ? JSON.parse(data) : [];
  },

  setChildren: (children: Child[]): void => {
    localStorage.setItem(STORAGE_KEYS.CHILDREN, JSON.stringify(children));
  },

  getRecords: (): PointRecord[] => {
    const data = localStorage.getItem(STORAGE_KEYS.RECORDS);
    return data ? JSON.parse(data) : [];
  },

  setRecords: (records: PointRecord[]): void => {
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
  },

  getRewards: (): Reward[] => {
    const data = localStorage.getItem(STORAGE_KEYS.REWARDS);
    return data ? JSON.parse(data) : [];
  },

  setRewards: (rewards: Reward[]): void => {
    localStorage.setItem(STORAGE_KEYS.REWARDS, JSON.stringify(rewards));
  },

  getCategories: (): PointCategory[] => {
    const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return data ? JSON.parse(data) : [];
  },

  setCategories: (categories: PointCategory[]): void => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  },
};
