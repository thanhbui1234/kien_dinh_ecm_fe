# FormMediaField

Upload ảnh/video với drag & drop, preview inline, tích hợp React Hook Form.

## Sử dụng

```tsx
import { FormMediaField } from "@/components/composite/FormMediaField";

<FormMediaField control={control} name="videoSrc" label="Video" accept="video/*" />
<FormMediaField control={control} name="logoSrc" label="Logo" accept="image/*" />
<FormMediaField control={control} name="media" label="Media" />  {/* cả ảnh + video */}
```

## Props

| Prop | Type | Default | Mô tả |
|------|------|---------|-------|
| `control` | `Control<T>` | *bắt buộc* | Control từ `useForm()` |
| `name` | `Path<T>` | *bắt buộc* | Tên field (type-safe) |
| `label` | `string` | *bắt buộc* | Label phía trên |
| `accept` | `string` | `"image/*,video/*"` | `"image/*"` chỉ ảnh, `"video/*"` chỉ video, `"image/*,video/*"` cả hai |
| `placeholder` | `string` | `"Drag & drop or click to select"` | Text trong drop zone |
| `hint` | `string` | — | Ghi chú dưới component |
| `maxSize` | `number` | `50MB` | Giới hạn file size (bytes) |
| `disabled` | `boolean` | `false` | Vô hiệu hóa |
| `className` | `string` | — | Class bổ sung |