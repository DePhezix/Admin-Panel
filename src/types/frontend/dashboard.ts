import type { Component } from "vue";
import type { TagProps } from "element-plus";

export interface dashboardCardType {
  title: string;
  icon: Component;
  total: number;
  covered: number;
  color: string;
  tagType: TagProps["type"];
}