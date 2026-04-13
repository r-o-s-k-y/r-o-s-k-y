'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { getProducts } from '@/lib/db'
import { Package, TrendingUp } from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    loading: true,
  })

  useEffect(() => {
    async function loadStats() {
      try {
        const products = await getProducts()
        setStats({
          totalProducts: products.length,
          loading: false,
        })
      } catch (error) {
        console.error('Error loading stats:', error)
        setStats((prev) => ({ ...prev, loading: false }))
      }
    }

    loadStats()
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome to your admin dashboard. Manage your products and inventory.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Products
              </p>
              <p className="text-3xl font-bold text-foreground mt-2">
                {stats.loading ? '...' : stats.totalProducts}
              </p>
            </div>
            <Package className="w-10 h-10 text-primary opacity-20" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Quick Actions
              </p>
              <p className="text-3xl font-bold text-foreground mt-2">
                Ready
              </p>
            </div>
            <TrendingUp className="w-10 h-10 text-primary opacity-20" />
          </div>
        </Card>
      </div>

      {/* Quick Links */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Quick Links
        </h2>
        <ul className="space-y-2 text-sm">
          <li>
            <a href="/admin/products" className="text-primary hover:underline">
              → Manage Products
            </a>
          </li>
          <li>
            <a
              href="/admin/products/new"
              className="text-primary hover:underline"
            >
              → Add New Product
            </a>
          </li>
        </ul>
      </Card>
    </div>
  )
}
