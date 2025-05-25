import React, { useEffect, useState, useRef } from "react"
import { virtualUrlService } from "../services/api" // Import the API service
import { RefreshCcw } from "lucide-react"

// Simple Badge component
function Badge({ variant = "default", children }) {
  const base = "inline-block px-2 py-0.5 rounded text-xs font-medium"
  const variants = {
    default: "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100",
    secondary: "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
    destructive: "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100",
  }
  return <span className={`${base} ${variants[variant] || variants.default}`}>{children}</span>
}

// Simple Button component (ghost icon style)
function Button({ variant, size, children, ...props }) {
  let className = "inline-flex items-center justify-center rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:hover:bg-gray-600"
  if (variant === "ghost") className += " bg-transparent"
  if (size === "icon") className += " w-8 h-8 p-0"
  return (
    <button className={className} {...props}>
      {children}
    </button>
  )
}

// Simple Progress bar
function Progress({ value }) {
  return (
    <div className="w-full h-2 bg-gray-200 rounded overflow-hidden dark:bg-gray-700">
      <div className="h-full bg-blue-600" style={{ width: `${value}%` }}></div>
    </div>
  )
}

// Dropdown menu implementation
function DropdownMenu({ children }) {
  return <div className="relative inline-block text-left">{children}</div>
}

function DropdownMenuTrigger({ children, onClick }) {
  return React.cloneElement(children, { onClick })
}

function DropdownMenuContent({ open, onClose, align = "start", children }) {
  const menuRef = useRef()
  const alignmentClass = align === "end" ? "right-0" : "left-0"

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose()
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      ref={menuRef}
      className={`absolute z-10 mt-2 w-48 bg-white border rounded shadow-lg dark:bg-gray-800 dark:border-gray-700 ${alignmentClass} divide-y divide-gray-100`}
      role="menu"
    >
      {children}
    </div>
  )
}

function DropdownMenuLabel({ children }) {
  return <div className="px-3 py-1 text-xs font-semibold text-slate-600 dark:text-gray-300">{children}</div>
}

function DropdownMenuSeparator() {
  return <div className="border-t border-slate-900 dark:border-slate-700" />
}

function DropdownMenuItem({ children, className = "", onClick }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center px-3 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 ${className}`}
      role="menuitem"
      tabIndex={0}
    >
      {children}
    </div>
  )
}

// Simple SVG Icons
function MoreHorizontal(props) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>

  )
}
function Pencil(props) {
  return (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
    </svg>
  )
}
function Trash(props) {
  return (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-2 14H7L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4h6v2" />
    </svg>
  )
}
function RefreshCw(props) {
  return (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <polyline points="1 4 1 10 7 10" />
      <polyline points="23 20 23 14 17 14" />
      <path d="M20.49 9a9 9 0 01-8.48 11.41 9 9 0 110-18" />
    </svg>
  )
}

export function VirtualURLTable() {

  // const bytesToMB = (bytes) => (bytes / (1024 * 1024)).toFixed(2);
  const bytesToGB = (bytes) => (bytes / (1024 * 1024 * 1024)).toFixed(2);

  const [storageAccounts, setStorageAccounts] = useState([])
  const [menuOpenId, setMenuOpenId] = useState(null)
  const [Refresh, setRefresh] = useState(true)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchStorageStats() {
      try {
        setLoading(true)
        const response = await virtualUrlService.getVirtualUrls({})
        console.log(response.data.data.virtualUrls)
        setStorageAccounts(response.data.data.virtualUrls) // Assuming the response structure contains data
        setLoading(false)
      } catch (e) {
        setLoading(false)
        console.error("Failed to fetch virtual URLS", e)
      }
    }

    fetchStorageStats()

    console.log(storageAccounts)
  }, [Refresh])

  useEffect(() => {
    console.log(Refresh)
  }, [Refresh])

  function formatDate(dateString) {
    console.log(dateString)
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "connected":
        return <Badge variant="default">Connected</Badge>
      case "disconnected":
        return <Badge variant="secondary">Disconnected</Badge>
      case "error":
        return <Badge variant="destructive">Error</Badge>
      default:
        return null
    }
  }

  return (

    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 border border-gray-300 rounded dark:border-gray-600 my-4">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Path</th>
             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Full Path</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Collection</th>
         {/*   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Last Synced</th> */}
            <th className="px-6 py-3 w-[70px]"></th>
          </tr>
        </thead>
        {loading ? (
          <tbody>
            <tr className="w-full">
              <td className="px-6 py-6 min-w-48 whitespace-nowrap">
                <div className="flex flex-col gap-1">
                  <div className="bg-slate-200 dark:bg-slate-600 h-4 grow animate-pulse rounded"></div>
                </div>
              </td>
              <td className="px-6 py-2 whitespace-nowrap">
                <div className="flex flex-col gap-1">
                  <div className="bg-slate-200 dark:bg-slate-600 h-2 grow animate-pulse rounded"></div>
                </div>
              </td>
              <td className="px-6 py-2 whitespace-nowrap">
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-center w-full">
                    <div className="bg-slate-200 dark:bg-slate-600 h-2 max-w-6 grow animate-pulse rounded"></div>
                    <div className="bg-slate-200 dark:bg-slate-600 h-2 max-w-6 grow animate-pulse rounded"></div>
                  </div>
                  <div className="bg-slate-200 dark:bg-slate-600 h-2 grow animate-pulse rounded"></div>
                </div>
              </td>
              <td className="px-6 py-2 whitespace-nowrap">
                <div className="flex flex-col gap-1">
                  <div className="bg-slate-200 dark:bg-slate-600 h-2 grow animate-pulse rounded"></div>
                </div>
              </td>
              <td className="px-6 py-2 whitespace-nowrap">
                <div className="flex flex-col gap-1">
                  <div className="bg-slate-200 dark:bg-slate-600 h-2 grow animate-pulse rounded"></div>
                </div>
              </td>
              <td className="px-6 py-2 whitespace-nowrap">
                <div className="flex flex-col gap-1">
                  <div className="bg-slate-200 dark:bg-slate-600 h-2 grow animate-pulse rounded"></div>
                </div>
              </td>
            </tr>
          </tbody>
        ) : (
          <tbody className="bg-white divide-y divide-gray-200 dark:divide-slate-600 dark:bg-gray-900">
            {storageAccounts.map((account) => (
              <tr className="group cursor-pointer" key={account.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900 dark:text-gray-100">{account.path}</div>
              
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">
                      <div className="text-xs text-gray-500 dark:text-gray-400">{account.fullPath}</div>
                  {/* <img className="filter grayscale group-hover:grayscale-0 transition duration-500 w-6 h-6 rounded" src={'/' + account.provider + '.jpeg'} alt="" /> */}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                      {/* <span>{bytesToGB(account.storageStats.total)} GB</span> */}
                      {account.collection.name}
                    </div>
                    {/* <Progress value={(account.storageStats.used / account.storageStats.total) * 100} /> */}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{account.targelURL}</td>
                {/* <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">{account.collection.name}</td> */}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      onClick={() => setMenuOpenId(menuOpenId === account._id ? null : account._id)}
                    >
                      <Button variant="ghost" size="icon" aria-label="Open menu">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent open={menuOpenId === account._id} onClose={() => setMenuOpenId(null)} align="end">
                      {/* <DropdownMenuItem onClick={async () => {
                    setLoading(true);
                    await virtualUrlService.(menuOpenId);
                    setRefresh(!Refresh);
                    setMenuOpenId(null);
                  }}>
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Sync Now
                  </DropdownMenuItem> */}
                      <DropdownMenuItem onClick={async () => {
                        if (window.confirm('Are you sure you want to delete this?')) {
                          setLoading(true);
                          await virtualUrlService.deleteVirtualUrl(menuOpenId);
                          setRefresh(!Refresh);
                          setMenuOpenId(null);
                        }
                      }} className="text-red-600 dark:text-red-400">
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        )}
      </table>
    </div>

  )
}