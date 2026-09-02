'use client';

import { type ReactNode, type SyntheticEvent, useState } from 'react';
import { ArrowRight, CheckCircle2, ClipboardList } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  NativeSelect,
  NativeSelectOption,
} from '@/components/ui/native-select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

const priorities = [
  { value: '普通', hint: '可排期' },
  { value: '较急', hint: '一周内' },
  { value: '紧急', hint: '需尽快' },
] as const;

type Priority = (typeof priorities)[number]['value'];

function makeRequestId() {
  const today = new Date();
  const date = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0'),
  ].join('');
  const tail = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `REQ-${date}-${tail}`;
}

function formValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === 'string' ? value : '';
}

function FieldLabel({
  children,
  htmlFor,
  optional = false,
}: {
  children: ReactNode;
  htmlFor: string;
  optional?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 flex items-center gap-1 text-[13px] font-medium text-[#292a2e]"
    >
      {children}
      {optional ? (
        <span className="font-normal text-[#96948d]">（选填）</span>
      ) : (
        <span className="text-[#e04520]">*</span>
      )}
    </label>
  );
}

export function RequirementForm() {
  const [priority, setPriority] = useState<Priority>('普通');
  const [description, setDescription] = useState('');
  const [requestId, setRequestId] = useState('');

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    const formData = new FormData(form);
    const id = makeRequestId();
    const payload = {
      id,
      title: formValue(formData, 'title'),
      type: formValue(formData, 'type'),
      priority,
      description,
      expectedDate: formValue(formData, 'expectedDate'),
      budget: formValue(formData, 'budget'),
      requester: formValue(formData, 'requester'),
      contact: formValue(formData, 'contact'),
      createdAt: new Date().toISOString(),
    };

    try {
      const saved = JSON.parse(
        window.localStorage.getItem('fde-requirement-demo') ?? '[]',
      ) as unknown[];
      window.localStorage.setItem(
        'fde-requirement-demo',
        JSON.stringify([payload, ...saved].slice(0, 20)),
      );
    } catch {
      // The front-end completion state remains usable when storage is blocked.
    }

    setRequestId(id);
  }

  if (requestId) {
    return (
      <Card className="border-0 bg-white py-0 shadow-[0_24px_70px_rgba(24,24,27,0.10)] ring-1 ring-black/[0.07]">
        <CardContent className="flex min-h-[610px] flex-col items-center justify-center px-6 py-12 text-center sm:px-12">
          <span className="mb-6 grid size-16 place-items-center rounded-full bg-[#e8f7ef] text-[#16854f]">
            <CheckCircle2 className="size-8" strokeWidth={1.8} />
          </span>
          <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[#e04520]">
            Draft saved
          </p>
          <h2 className="text-2xl font-semibold tracking-[-0.035em] text-[#17181c] sm:text-[30px]">
            需求信息已记录
          </h2>
          <div className="my-7 rounded-xl border border-dashed border-black/[0.13] bg-[#faf9f6] px-5 py-3 font-mono text-sm font-semibold tracking-[0.04em] text-[#313238]">
            {requestId}
          </div>
          <Button
            type="button"
            onClick={() => setRequestId('')}
            className="h-11 rounded-[10px] bg-[#17181c] px-5 text-sm text-white hover:bg-[#2b2c31]"
          >
            继续提交一个需求
            <ArrowRight className="size-4" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 bg-white py-0 shadow-[0_24px_70px_rgba(24,24,27,0.10)] ring-1 ring-black/[0.07]">
      <CardHeader className="border-b border-black/[0.06] px-5 py-5 sm:px-8 sm:py-6">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-[10px] bg-[#f5eee9] text-[#e04520]">
            <ClipboardList className="size-[18px]" />
          </span>
          <div>
            <CardTitle className="text-lg font-semibold tracking-[-0.02em] text-[#17181c]">
              提交一个新需求
            </CardTitle>
            <CardDescription className="mt-1 text-[13px] leading-5 text-[#77756f]">
              带 <span className="text-[#e04520]">*</span> 的内容需要填写，约 3 分钟完成
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-5 py-6 sm:px-8 sm:py-7">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <FieldLabel htmlFor="title">需求标题</FieldLabel>
            <Input
              id="title"
              name="title"
              required
              placeholder="例如：官网新增线索收集表单"
              className="h-11 rounded-[10px] border-black/[0.12] bg-[#fbfbfa] px-3.5 text-sm focus-visible:border-[#e04520] focus-visible:ring-[#e04520]/15"
            />
          </div>

          <div>
            <FieldLabel htmlFor="type">需求类型</FieldLabel>
            <NativeSelect
              id="type"
              name="type"
              required
              defaultValue=""
              className="w-full [&_[data-slot=native-select]]:h-11 [&_[data-slot=native-select]]:rounded-[10px] [&_[data-slot=native-select]]:border-black/[0.12] [&_[data-slot=native-select]]:bg-[#fbfbfa] [&_[data-slot=native-select]]:px-3.5 [&_[data-slot=native-select]]:text-sm [&_[data-slot=native-select]]:focus-visible:border-[#e04520] [&_[data-slot=native-select]]:focus-visible:ring-[#e04520]/15"
            >
              <NativeSelectOption value="" disabled>
                请选择需求类型
              </NativeSelectOption>
              <NativeSelectOption value="网站与产品">网站与产品</NativeSelectOption>
              <NativeSelectOption value="数据与自动化">数据与自动化</NativeSelectOption>
              <NativeSelectOption value="AI 能力">AI 能力</NativeSelectOption>
              <NativeSelectOption value="设计支持">设计支持</NativeSelectOption>
              <NativeSelectOption value="运营支持">运营支持</NativeSelectOption>
              <NativeSelectOption value="其他">其他</NativeSelectOption>
            </NativeSelect>
          </div>

          <fieldset>
            <legend className="mb-2 text-[13px] font-medium text-[#292a2e]">
              优先级 <span className="text-[#e04520]">*</span>
            </legend>
            <div className="grid grid-cols-3 gap-2">
              {priorities.map((item) => (
                <label
                  key={item.value}
                  className={cn(
                    'cursor-pointer rounded-[10px] border px-3 py-2.5 text-center transition-all',
                    priority === item.value
                      ? 'border-[#17181c] bg-[#17181c] text-white shadow-sm'
                      : 'border-black/[0.09] bg-[#faf9f6] text-[#4d4d4a] hover:border-black/20 hover:bg-white',
                  )}
                >
                  <input
                    type="radio"
                    name="priority"
                    value={item.value}
                    checked={priority === item.value}
                    onChange={() => setPriority(item.value)}
                    className="sr-only"
                  />
                  <span className="block text-[13px] font-medium">{item.value}</span>
                  <span
                    className={cn(
                      'mt-0.5 block text-[10px]',
                      priority === item.value ? 'text-white/60' : 'text-[#9a9891]',
                    )}
                  >
                    {item.hint}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <FieldLabel htmlFor="description">需求描述</FieldLabel>
              <span className="text-[11px] tabular-nums text-[#9a9891]">
                {description.length}/800
              </span>
            </div>
            <Textarea
              id="description"
              name="description"
              required
              maxLength={800}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="请写清楚使用场景、目标用户、希望解决的问题，以及你期待的结果…"
              className="min-h-28 resize-y rounded-[10px] border-black/[0.12] bg-[#fbfbfa] px-3.5 py-3 text-sm leading-6 focus-visible:border-[#e04520] focus-visible:ring-[#e04520]/15"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="expectedDate" optional>
                期望交付时间
              </FieldLabel>
              <Input
                id="expectedDate"
                name="expectedDate"
                type="date"
                className="h-11 rounded-[10px] border-black/[0.12] bg-[#fbfbfa] px-3.5 text-sm focus-visible:border-[#e04520] focus-visible:ring-[#e04520]/15"
              />
            </div>
            <div>
              <FieldLabel htmlFor="budget" optional>
                预算范围
              </FieldLabel>
              <NativeSelect
                id="budget"
                name="budget"
                defaultValue=""
                className="w-full [&_[data-slot=native-select]]:h-11 [&_[data-slot=native-select]]:rounded-[10px] [&_[data-slot=native-select]]:border-black/[0.12] [&_[data-slot=native-select]]:bg-[#fbfbfa] [&_[data-slot=native-select]]:px-3.5 [&_[data-slot=native-select]]:text-sm [&_[data-slot=native-select]]:focus-visible:border-[#e04520] [&_[data-slot=native-select]]:focus-visible:ring-[#e04520]/15"
              >
                <NativeSelectOption value="">暂不确定</NativeSelectOption>
                <NativeSelectOption value="5000 元以内">5,000 元以内</NativeSelectOption>
                <NativeSelectOption value="5000-20000 元">5,000–20,000 元</NativeSelectOption>
                <NativeSelectOption value="20000 元以上">20,000 元以上</NativeSelectOption>
              </NativeSelect>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="requester">提交人</FieldLabel>
              <Input
                id="requester"
                name="requester"
                required
                autoComplete="name"
                placeholder="你的姓名"
                className="h-11 rounded-[10px] border-black/[0.12] bg-[#fbfbfa] px-3.5 text-sm focus-visible:border-[#e04520] focus-visible:ring-[#e04520]/15"
              />
            </div>
            <div>
              <FieldLabel htmlFor="contact">联系方式</FieldLabel>
              <Input
                id="contact"
                name="contact"
                required
                placeholder="飞书 / 手机 / 邮箱"
                className="h-11 rounded-[10px] border-black/[0.12] bg-[#fbfbfa] px-3.5 text-sm focus-visible:border-[#e04520] focus-visible:ring-[#e04520]/15"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="h-12 w-full rounded-[10px] bg-[#e04520] px-5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(224,69,32,0.22)] hover:-translate-y-px hover:bg-[#c93b1a] active:translate-y-0"
          >
            提交需求
            <ArrowRight className="size-4" />
          </Button>

        </form>
      </CardContent>
    </Card>
  );
}
