import CIcon from "@coreui/icons-react";
import { freeSet, brandSet } from "@coreui/icons";
import { roles } from "../../common/roles";
import React from "react";

let navigation: any[] = [
  {
    _tag: "CSidebarNavItem",
    name: "Quản lý thông tin cán bộ",
    to: "/thong-tin-can-bo",
    role: [roles.ADMIN, roles.MANAGER, roles.DEPARTMENT],
    icon: (
      <CIcon content={freeSet.cilHome} customClasses="c-sidebar-nav-icon" />
    ),
  },
  {
    _tag: "CSidebarNavItem",
    name: "Quản lý thông tin cán bộ",
    to: "/thong-tin",
    role: [roles.PARTICIPANT],
    icon: (
      <CIcon content={freeSet.cilHome} customClasses="c-sidebar-nav-icon" />
    ),
  },
  {
    _tag: "CSidebarNavTitle",
    role: [roles.MANAGER, roles.PARTICIPANT],
    _children: ["Quản lý Hồ sơ"],
  },

  {
    _tag: "CSidebarNavItem",
    name: "Quản lý Hồ sơ",
    to: "/danh-hieu",
    role: [roles.MANAGER],
    icon: (
      <CIcon
        content={brandSet.cibCoursera}
        customClasses="c-sidebar-nav-icon"
      />
    ),
  },
  {
    _tag: "CSidebarNavItem",
    name: "Đề cử Hồ sơ",
    to: "/de-cu",
    role: [roles.PARTICIPANT],
    icon: (
      <CIcon
        content={brandSet.cibCoursera}
        customClasses="c-sidebar-nav-icon"
      />
    ),
  },

  {
    _tag: "CSidebarNavItem",
    name: "Lịch sử đề cử Hồ sơ",
    to: "/lich-su-de-cu",
    role: [roles.PARTICIPANT],
    icon: (
      <CIcon
        content={brandSet.cibCoursera}
        customClasses="c-sidebar-nav-icon"
      />
    ),
  },
  {
    _tag: "CSidebarNavTitle",
    role: [roles.ADMIN],
    _children: ["Cấu hình hệ thống"],
  },

  {
    _tag: "CSidebarNavItem",
    name: "Quản lý bộ phận",
    to: "/department-manager",
    role: [roles.ADMIN],
    icon: (
      <CIcon
        content={brandSet.cibCoursera}
        customClasses="c-sidebar-nav-icon"
      />
    ),
  },

  {
    _tag: "CSidebarNavItem",
    name: "Quản lý người dùng",
    to: "/quan-li-nguoi-dung",
    role: [roles.ADMIN],
    icon: (
      <CIcon
        content={brandSet.cibCoursera}
        customClasses="c-sidebar-nav-icon"
      />
    ),
  },
  {
    _tag: "CSidebarNavTitle",
    role: [roles.MANAGER, roles.DEPARTMENT],
    _children: ["Quản lý hoạt động"],
  },
  {
    _tag: "CSidebarNavItem",
    name: "QL đợt hoạt động",
    to: "/quan-ly-dot-hoat-dong",
    role: [roles.MANAGER],
    icon: (
      <CIcon
        content={brandSet.cibCoursera}
        customClasses="c-sidebar-nav-icon"
      />
    ),
  },
  {
    _tag: "CSidebarNavItem",
    name: "QL nhóm hoạt động",
    to: "/quan-ly-nhom-hoat-dong",
    role: [roles.MANAGER],
    icon: (
      <CIcon
        content={brandSet.cibCoursera}
        customClasses="c-sidebar-nav-icon"
      />
    ),
  },
  {
    _tag: "CSidebarNavItem",
    name: "QL hoạt động",
    to: "/quan-ly-hoat-dong",
    role: [roles.MANAGER, roles.DEPARTMENT],
    icon: (
      <CIcon
        content={brandSet.cibCoursera}
        customClasses="c-sidebar-nav-icon"
      />
    ),
  },
  {
    _tag: "CSidebarNavTitle",
    role: [roles.PARTICIPANT],
    _children: ["Hoạt động"],
  },
  {
    _tag: "CSidebarNavItem",
    name: "Đăng ký hoạt động",
    to: "/dang-ky-hoat-dong",
    role: [roles.PARTICIPANT],
    icon: (
      <CIcon
        content={brandSet.cibCoursera}
        customClasses="c-sidebar-nav-icon"
      />
    ),
  },
  {
    _tag: "CSidebarNavItem",
    name: "Lịch sử hoạt động",
    to: "/lich-su-dang-ky",
    role: [roles.PARTICIPANT],
    icon: (
      <CIcon
        content={brandSet.cibCoursera}
        customClasses="c-sidebar-nav-icon"
      />
    ),
  },
  {
    _tag: 'CSidebarNavTitle',
    role: [roles.MANAGER, roles.DEPARTMENT],
    _children: ['Thi đua'],
  },
  {
    _tag: "CSidebarNavItem",
    name: "Quản lý Thi Đua",
    to: "/thi-dua",
    role: [roles.MANAGER],
    icon: (
      <CIcon
        content={brandSet.cibCoursera}
        customClasses="c-sidebar-nav-icon"
      />
    ),
  },
  {
    _tag: "CSidebarNavItem",
    name: "Đề Cử Thi Đua",
    to: "/danh-sach-thi-dua",
    role: [roles.DEPARTMENT],
    icon: (
      <CIcon
        content={brandSet.cibCoursera}
        customClasses="c-sidebar-nav-icon"
      />
    ),
  },
  {
    _tag: "CSidebarNavItem",
    name: "Lịch Sử Thi Đua",
    to: "/lich-su-thi-dua",
    role: [roles.DEPARTMENT],
    icon: (
      <CIcon
        content={brandSet.cibCoursera}
        customClasses="c-sidebar-nav-icon"
      />
    ),
  },
];

export default navigation;
