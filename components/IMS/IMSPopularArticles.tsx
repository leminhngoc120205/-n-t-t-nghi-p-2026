'use client'

import React, { useState } from 'react'

const articles = [
  {
    title: 'Đừng bật điều hòa ở mức 26 độ C vào ban đêm, lý do nguy hiểm hơn bạn nghĩ',
    publishDate: '10:22',
    publishDay: '28/05/2026',
    reading: 1,
    totalView: 605,
    ctr: '8.96%',
    bounce: '98.35%',
    source: 85,
  },
  {
    title: 'Tôi không biết Apple 20 năm nữa ra sao, nhưng Samsung thì tôi biết',
    publishDate: '13:42',
    publishDay: '28/05/2026',
    reading: 1,
    totalView: 539,
    ctr: '3.09%',
    bounce: '99.26%',
    source: 70,
  },
  {
    title: "Hồ sơ chấn động: Dòng tiền BYD đã kiệt quệ, nợ 'khủng' 45 tỷ USD, từng chiếm dụng vốn loạt nhà cung ứng với lãi suất 0%",
    publishDate: '07:59',
    publishDay: '28/05/2026',
    reading: 2,
    totalView: 522,
    ctr: '3.17%',
    bounce: '98.08%',
    source: 65,
  },
  {
    title: 'LG cân nhắc bán mảng TV cho Hisense? Biểu tượng điện tử gần 60 năm đứng trước hồi kết',
    publishDate: '13:37',
    publishDay: '28/05/2026',
    reading: 0,
    totalView: 483,
    ctr: '0.75%',
    bounce: '97.31%',
    source: 60,
  },
]

export const IMSPopularArticles = () => {
  const [device, setDevice] = useState('Desktop')

  return (
    <div className="bg-white border border-gray-200 rounded mb-5">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h2 className="text-[13px] font-bold text-[#17a2b8] tracking-wide uppercase">
          Bài viết đang được đọc nhiều
        </h2>
        <select
          value={device}
          onChange={(e) => setDevice(e.target.value)}
          className="text-xs border border-gray-300 rounded px-3 py-1.5 text-gray-600 focus:outline-none focus:border-[#17a2b8]"
        >
          <option>Desktop</option>
          <option>Mobile</option>
        </select>
      </div>

      {/* Table */}
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left px-5 py-2.5 text-gray-500 font-medium">Tiêu đề</th>
            <th className="text-center px-3 py-2.5 text-gray-500 font-medium whitespace-nowrap">Ngày xuất bản</th>
            <th className="text-center px-3 py-2.5 text-gray-500 font-medium whitespace-nowrap">Đang đọc</th>
            <th className="text-center px-3 py-2.5 text-gray-500 font-medium whitespace-nowrap">Tổng view</th>
            <th className="text-center px-3 py-2.5 text-gray-500 font-medium whitespace-nowrap">
              CTR
              <span className="ml-0.5 inline-flex items-center justify-center w-3.5 h-3.5 rounded-full border border-gray-300 text-[9px] text-gray-400 cursor-help">?</span>
            </th>
            <th className="text-center px-3 py-2.5 text-gray-500 font-medium whitespace-nowrap">
              Rời trang
              <span className="ml-0.5 inline-flex items-center justify-center w-3.5 h-3.5 rounded-full border border-gray-300 text-[9px] text-gray-400 cursor-help">?</span>
            </th>
            <th className="text-center px-3 py-2.5 text-gray-500 font-medium whitespace-nowrap">Nguồn đến từ</th>
          </tr>
        </thead>
        <tbody>
          {articles.map((article, i) => (
            <tr
              key={i}
              className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
            >
              <td className="px-5 py-3 text-gray-700 leading-snug max-w-xs">
                <a href="#" className="hover:text-[#17a2b8] transition-colors line-clamp-2">
                  {article.title}
                </a>
              </td>
              <td className="px-3 py-3 text-center text-gray-500 whitespace-nowrap">
                <div>{article.publishDate}</div>
                <div>{article.publishDay}</div>
              </td>
              <td className="px-3 py-3 text-center">
                {article.reading > 0 ? (
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-orange-400 text-white font-bold text-[11px]">
                    {article.reading}
                  </span>
                ) : (
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-gray-500 font-bold text-[11px]">
                    {article.reading}
                  </span>
                )}
              </td>
              <td className="px-3 py-3 text-center text-gray-700 font-medium">
                {article.totalView.toLocaleString()}
              </td>
              <td className="px-3 py-3 text-center text-gray-600">{article.ctr}</td>
              <td className="px-3 py-3 text-center">
                <span className="px-2 py-0.5 rounded text-[11px] font-medium text-red-400 bg-red-50">
                  {article.bounce}
                </span>
              </td>
              <td className="px-3 py-3 text-center">
                <div className="flex justify-center">
                  <div className="w-16 h-4 bg-gray-100 rounded overflow-hidden">
                    <div
                      className="h-full bg-orange-400 rounded"
                      style={{ width: `${article.source}%` }}
                    />
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
