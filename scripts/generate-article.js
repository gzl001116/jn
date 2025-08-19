const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// 初始化OpenAI客户端
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// 获取历史上的今天日期（格式：MM-DD）
function getHistoricalDate() {
  const date = new Date();
  // 为了获取历史事件，我们使用去年的今天
  date.setFullYear(date.getFullYear() - 1);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${month}-${day}`;
}

// 生成文章内容
async function generateArticle() {
  const date = getHistoricalDate();
  const prompt = `生成一篇关于历史上${date}发生的重要事件的博客文章。要求：
1. 包含3-5个重要历史事件
2. 每个事件包含时间、地点、人物和影响
3. 语言生动有趣，适合博客阅读
4. 字数800-1000字
5. 文章结尾添加"#历史上的今天"标签`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('AI文章生成失败:', error);
    throw error;
  }
}

// 格式化文章为Hugo markdown格式
function formatAsHugoMarkdown(content, date) {
  const title = `历史上的今天: ${date}`;
  const slug = `historical-event-${date.replace(/-/g, '')}`;
  const today = new Date().toISOString().split('T')[0];

  return `---
title: "${title}"
date: "${today}"
draft: false
categories: ["历史"]
tags: ["历史事件"]
---

${content.replace(/`/g, '\\`')}`;
}