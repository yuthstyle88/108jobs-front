'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'
import React from 'react'

const JobBoardTab = () => {
  const pathname = usePathname();
  const pathWithoutLang = '/' + pathname.split('/').slice(2).join('/');

  const excludedPaths = ['/job-board/proposal', '/job-board/jobs'];

  const isAllJobPostsActive =
    pathWithoutLang === '/job-board' ||
    (pathWithoutLang.startsWith('/job-board/') &&
      !excludedPaths.includes(pathWithoutLang));

  return (
    <div className="flex -mb-px">
      <Link prefetch={false}
            href="/job-board"
            className={`mr-6 py-2 text-[18px] font-medium border-b-2 ${isAllJobPostsActive
              ? 'text-blue-600 border-blue-600'
              : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
      >
        All Job Posts
      </Link>

      <Link prefetch={false}
            href="/job-board/offers"
            className={`mr-6 py-2 text-[18px] font-medium border-b-2 ${pathWithoutLang === '/job-board/proposal'
              ? 'text-blue-600 border-blue-600'
              : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
      >
        Jobs you have proposed
      </Link>

      <Link prefetch={false}
            href="/job-board/jobs"
            className={`py-2 text-[18px] font-medium border-b-2 ${pathWithoutLang === '/job-board/jobs'
              ? 'text-blue-600 border-blue-600'
              : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
      >
        Jobs you have posted
      </Link>
    </div>
  )
}

export default JobBoardTab
