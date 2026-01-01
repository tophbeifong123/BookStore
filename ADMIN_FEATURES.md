# Admin Panel สำหรับ Book Store

## ✅ สิ่งที่แก้ไข

### 1. **แก้ไขปัญหา Admin เข้าหน้า Home และ Library ไม่ได้**

- ปัญหาเดิม: ไม่มีปัญหาเกี่ยวกับการเข้าถึง - Admin สามารถเข้าหน้า Home และ Library ได้ตามปกติ
- **หมายเหตุ:** หน้า Home และ Library แสดงเฉพาะหนังสือที่มีสถานะ `published` เท่านั้น หากไม่มีหนังสือ ให้สร้างหนังสือใหม่และเปลี่ยนสถานะเป็น `published`

### 2. **เพิ่มหน้าจัดการ Users (Admin Panel)**

✅ สร้างหน้า `/admin/users` สำหรับจัดการผู้ใช้

- ดูรายชื่อผู้ใช้ทั้งหมด
- เปลี่ยน Role (User/Admin)
- ลบผู้ใช้
- API: `GET/POST/PATCH/DELETE /api/users`

### 3. **เพิ่มหน้าจัดการ Book Approvals (Admin Panel)**

✅ สร้างหน้า `/admin/approvals` สำหรับจัดการการอนุมัติหนังสือ

- ดูรายการหนังสือที่รอการอนุมัติ
- อนุมัติหนังสือ (Approve)
- ปฏิเสธหนังสือ (Reject) พร้อมเหตุผล
- แสดง Preview ข้อมูลหนังสือ

### 4. **อัพเดท API Documentation**

✅ อัพเดทไฟล์ `API.md` พร้อมเอกสาร API ใหม่

- เพิ่ม endpoints สำหรับ Admin
- เพิ่มตัวอย่างการใช้งาน

## 📁 ไฟล์ที่เพิ่ม/แก้ไข

### Backend (NestJS)

- `server/src/modules/books/books.controller.ts` - เพิ่ม endpoints: `/pending`, `/approve`, `/reject`
- `server/src/modules/books/books.service.ts` - เพิ่มฟังก์ชัน: `findPending()`, `approve()`, `reject()`

### Frontend (React)

- `client/src/routes/admin/layout.tsx` - Layout สำหรับ Admin Panel
- `client/src/routes/admin/index.tsx` - หน้า Dashboard
- `client/src/routes/admin/users.tsx` - หน้าจัดการ Users
- `client/src/routes/admin/approvals.tsx` - หน้าจัดการ Book Approvals
- `client/src/main.tsx` - เพิ่ม routes สำหรับ Admin
- `client/src/components/ui/table.tsx` - Table component
- `client/src/components/ui/dialog.tsx` - Dialog component
- `client/src/components/ui/select.tsx` - Select component

### Documentation

- `API.md` - อัพเดทเอกสาร API

## 🚀 วิธีติดตั้ง Dependencies

### สิ่งที่ต้องติดตั้งเพิ่ม (Frontend):

```bash
cd client

# ติดตั้ง Radix UI components
pnpm add @radix-ui/react-dialog @radix-ui/react-select

# ติดตั้ง Toast notification library
pnpm add sonner
```

## 🔐 การเข้าถึง Admin Panel

1. **Login เป็น Admin:**
   - Email: admin@bookstore.com (ต้องสร้าง user นี้ก่อน หรือเปลี่ยน role ของ user ที่มี)
2. **เข้าถึง Admin Panel:**

   - คลิกที่ Avatar ของคุณที่มุมขวาบน
   - คลิกที่ "Admin Panel"
   - หรือไปที่ URL: `http://localhost:5173/admin`

3. **Navigation:**
   - **Dashboard** (`/admin`) - สรุปสถิติทั้งหมด
   - **Users** (`/admin/users`) - จัดการผู้ใช้
   - **Book Approvals** (`/admin/approvals`) - จัดการการอนุมัติหนังสือ

## 📖 API Endpoints ใหม่

### Users Management

```http
GET    /api/users          # Get all users (Admin only)
GET    /api/users/:id      # Get user by ID (Admin only)
POST   /api/users          # Create user (Admin only)
PATCH  /api/users/:id      # Update user (Admin only)
DELETE /api/users/:id      # Delete user (Admin only)
```

### Book Approvals

```http
GET    /api/books/pending       # Get pending books (Admin only)
PATCH  /api/books/:id/approve   # Approve book (Admin only)
PATCH  /api/books/:id/reject    # Reject book (Admin only)
```

## 🎯 Features

### Dashboard

- แสดงจำนวน Users ทั้งหมด
- แสดงจำนวน Books ทั้งหมด
- แสดงจำนวนหนังสือที่รออนุมัติ
- แสดงจำนวนหนังสือที่อนุมัติแล้ว

### User Management

- ดูรายชื่อผู้ใช้ทั้งหมดในตาราง
- เปลี่ยน Role (User ↔ Admin) ผ่าน dropdown
- ลบผู้ใช้พร้อม confirmation dialog
- แสดงสถานะ Active/Inactive

### Book Approvals

- ดูรายการหนังสือที่รอการอนุมัติ
- Preview ข้อมูลหนังสือก่อนอนุมัติ
- อนุมัติหนังสือด้วยปุ่ม ✓
- ปฏิเสธหนังสือด้วยปุ่ม ✗ (สามารถใส่เหตุผลได้)
- แสดงปก, ชื่อ, ผู้แต่ง, ประเภท, และ tags

## 🔒 Security

- ทุก Admin endpoints ใช้ `JwtAuthGuard` + `RolesGuard`
- ต้องมี Role เป็น `admin` ถึงจะเข้าถึงได้
- Frontend มีการ redirect ถ้าไม่ใช่ admin

## 🌐 Environment

ตรวจสอบว่า `.env` มีค่าเหล่านี้:

```env
# Backend
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret

# Frontend
VITE_API_URL=http://localhost:8000/api
```

## 📝 หมายเหตุ

1. **Approval Status โดยค่าเริ่มต้น:** เมื่อสร้างหนังสือใหม่จะมีสถานะ `approved` โดยอัตโนมัติ (ตามที่กำหนดใน `book.entity.ts`)
2. **Published vs Draft:** หน้า Home และ Library แสดงเฉพาะหนังสือที่มี `status = 'published'` เท่านั้น
3. **Missing Packages:** อย่าลืมติดตั้ง `@radix-ui/react-dialog`, `@radix-ui/react-select`, และ `sonner`

## 🐛 Troubleshooting

### ปัญหา: ไม่เห็นหนังสือในหน้า Home/Library

**วิธีแก้:**

- ตรวจสอบว่าหนังสือมี `status = 'published'`
- ตรวจสอบว่าหนังสือมี `approvalStatus = 'approved'`

### ปัญหา: เข้า Admin Panel ไม่ได้

**วิธีแก้:**

- ตรวจสอบว่า user ของคุณมี `role = 'admin'`
- ใช้ SQL: `UPDATE users SET role = 'admin' WHERE email = 'your@email.com'`

### ปัญหา: Build error ตอน import components

**วิธีแก้:**

```bash
cd client
pnpm add @radix-ui/react-dialog @radix-ui/react-select sonner
```
