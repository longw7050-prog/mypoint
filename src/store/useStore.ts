/**
 * useStore.ts - 全局状态管理
 * 
 * 【作用】
 * 使用 Zustand 管理应用的所有全局状态，包括：
 * - children: 孩子列表
 * - records: 积分记录列表
 * - rewards: 可兑换奖励列表
 * - categories: 积分类别列表（获得/消费）
 * - selectedChildId: 当前选中的孩子ID
 * 
 * 提供所有数据的 CRUD 操作，数据变更时自动持久化到 localStorage
 * 
 * 【依赖】
 * - zustand: 状态管理库
 * - types/index.ts: 类型定义
 * - utils/storage.ts: 本地存储工具
 * 
 * 【被调用】
 * - 所有页面和组件通过 useStore() hook 获取/修改状态
 */
import { create } from 'zustand';
import { Child, PointRecord, Reward, PointCategory, Goal, DEFAULT_EARN_CATEGORIES, DEFAULT_SPEND_CATEGORIES } from '../types';
import { storage } from '../utils/storage';

interface AppState {
  children: Child[];
  records: PointRecord[];
  rewards: Reward[];
  categories: PointCategory[];
  goals: Goal[];
  selectedChildId: string | null;
  
  loadData: () => void;
  addChild: (child: Omit<Child, 'id' | 'totalPoints' | 'createdAt'>) => void;
  updateChild: (id: string, updates: Partial<Child>) => void;
  deleteChild: (id: string) => void;
  
  addRecord: (record: Omit<PointRecord, 'id' | 'createdAt'>) => void;
  deleteRecord: (id: string) => void;
  
  addReward: (reward: Omit<Reward, 'id'>) => void;
  deleteReward: (id: string) => void;
  
  addCategory: (category: Omit<PointCategory, 'id'>) => void;
  updateCategory: (id: string, updates: Partial<PointCategory>) => void;
  deleteCategory: (id: string) => void;
  
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt'>) => void;
  deleteGoal: (id: string) => void;
  
  setSelectedChild: (id: string | null) => void;
  getChildPoints: (childId: string) => number;
}

export const useStore = create<AppState>((set, get) => ({
  children: [],
  records: [],
  rewards: [],
  categories: [...DEFAULT_EARN_CATEGORIES, ...DEFAULT_SPEND_CATEGORIES],
  goals: [],
  selectedChildId: null,

  loadData: () => {
    const children = storage.getChildren();
    const records = storage.getRecords();
    const rewards = storage.getRewards();
    const categories = storage.getCategories();
    const selectedChildId = storage.getSelectedChild();
    const goals = storage.getGoals();
    set({
      children,
      records,
      rewards: rewards.length > 0 ? rewards : [],
      categories: categories.length > 0 ? categories : [...DEFAULT_EARN_CATEGORIES, ...DEFAULT_SPEND_CATEGORIES],
      selectedChildId,
      goals,
    });
  },

  addChild: (childData) => {
    const newChild: Child = {
      ...childData,
      id: Date.now().toString(),
      totalPoints: 0,
      createdAt: new Date().toISOString(),
    };
    const children = [...get().children, newChild];
    set({ children });
    storage.setChildren(children);
  },

  updateChild: (id, updates) => {
    const children = get().children.map(child =>
      child.id === id ? { ...child, ...updates } : child
    );
    set({ children });
    storage.setChildren(children);
  },

  deleteChild: (id) => {
    const children = get().children.filter(child => child.id !== id);
    const records = get().records.filter(record => record.childId !== id);
    set({ children, records });
    storage.setChildren(children);
    storage.setRecords(records);
  },

  addRecord: (recordData) => {
    const newRecord: PointRecord = {
      ...recordData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    
    const records = [...get().records, newRecord];
    const children = get().children.map(child => {
      if (child.id === recordData.childId) {
        const pointChange = recordData.type === 'earn' ? recordData.amount : -recordData.amount;
        return { ...child, totalPoints: child.totalPoints + pointChange };
      }
      return child;
    });
    
    set({ records, children });
    storage.setRecords(records);
    storage.setChildren(children);
  },

  deleteRecord: (id) => {
    const record = get().records.find(r => r.id === id);
    if (!record) return;
    
    const records = get().records.filter(r => r.id !== id);
    const children = get().children.map(child => {
      if (child.id === record.childId) {
        const pointChange = record.type === 'earn' ? -record.amount : record.amount;
        return { ...child, totalPoints: Math.max(0, child.totalPoints + pointChange) };
      }
      return child;
    });
    
    set({ records, children });
    storage.setRecords(records);
    storage.setChildren(children);
  },

  addReward: (rewardData) => {
    const newReward: Reward = {
      ...rewardData,
      id: Date.now().toString(),
    };
    const rewards = [...get().rewards, newReward];
    set({ rewards });
    storage.setRewards(rewards);
  },

  deleteReward: (id) => {
    const rewards = get().rewards.filter(r => r.id !== id);
    set({ rewards });
    storage.setRewards(rewards);
  },

  addCategory: (categoryData) => {
    const newCategory: PointCategory = {
      ...categoryData,
      id: Date.now().toString(),
    };
    const categories = [...get().categories, newCategory];
    set({ categories });
    storage.setCategories(categories);
  },

  updateCategory: (id, updates) => {
    const categories = get().categories.map(c =>
      c.id === id ? { ...c, ...updates } : c
    );
    set({ categories });
    storage.setCategories(categories);
  },

  deleteCategory: (id) => {
    const categories = get().categories.filter(c => c.id !== id);
    set({ categories });
    storage.setCategories(categories);
  },

  addGoal: (goalData) => {
    const newGoal: Goal = {
      ...goalData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    const goals = [...get().goals, newGoal];
    set({ goals });
    storage.setGoals(goals);
  },

  deleteGoal: (id) => {
    const goals = get().goals.filter(g => g.id !== id);
    set({ goals });
    storage.setGoals(goals);
  },

  setSelectedChild: (id) => {
    set({ selectedChildId: id });
    storage.setSelectedChild(id);
  },

  getChildPoints: (childId) => {
    const child = get().children.find(c => c.id === childId);
    return child?.totalPoints || 0;
  },
}));
