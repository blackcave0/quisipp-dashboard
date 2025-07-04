"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle, CheckCircle, Clock, RefreshCw, Zap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface WebhookEvent {
  id: string
  posSystem: string
  eventType: "transaction.created" | "transaction.updated" | "inventory.updated" | "customer.created"
  payload: any
  timestamp: string
  status: "processed" | "failed" | "pending"
  retryCount: number
  processingTime: number
}

const mockWebhookEvents: WebhookEvent[] = [
  {
    id: "wh-001",
    posSystem: "square",
    eventType: "transaction.created",
    payload: {
      transactionId: "SQ-TXN-12345",
      amount: 45.67,
      items: [
        { name: "Organic Bananas", quantity: 2, price: 2.99 },
        { name: "Whole Wheat Bread", quantity: 1, price: 3.49 },
      ],
    },
    timestamp: "2024-01-17T10:15:00Z",
    status: "processed",
    retryCount: 0,
    processingTime: 120,
  },
  {
    id: "wh-002",
    posSystem: "shopify",
    eventType: "inventory.updated",
    payload: {
      productId: "PROD-123",
      sku: "ORG-BAN-001",
      quantityChange: -5,
      newQuantity: 145,
    },
    timestamp: "2024-01-17T10:10:00Z",
    status: "processed",
    retryCount: 0,
    processingTime: 85,
  },
  {
    id: "wh-003",
    posSystem: "clover",
    eventType: "transaction.created",
    payload: {
      transactionId: "CLV-TXN-67890",
      amount: 28.45,
    },
    timestamp: "2024-01-17T10:05:00Z",
    status: "failed",
    retryCount: 3,
    processingTime: 0,
  },
]

export function POSWebhookHandler() {
  const { toast } = useToast()
  const [webhookEvents, setWebhookEvents] = useState<WebhookEvent[]>(mockWebhookEvents)
  const [isProcessing, setIsProcessing] = useState(false)

  // Simulate real-time webhook events
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newEvent: WebhookEvent = {
          id: `wh-${Date.now()}`,
          posSystem: ["square", "shopify", "clover"][Math.floor(Math.random() * 3)],
          eventType: ["transaction.created", "inventory.updated", "customer.created"][
            Math.floor(Math.random() * 3)
          ] as any,
          payload: {
            transactionId: `TXN-${Math.floor(Math.random() * 10000)}`,
            amount: Math.floor(Math.random() * 100) + 10,
          },
          timestamp: new Date().toISOString(),
          status: Math.random() > 0.8 ? "failed" : "processed",
          retryCount: 0,
          processingTime: Math.floor(Math.random() * 200) + 50,
        }

        setWebhookEvents((prev) => [newEvent, ...prev.slice(0, 19)])

        toast({
          title: "New Webhook Event",
          description: `${newEvent.eventType} from ${newEvent.posSystem}`,
        })
      }
    }, 10000) // Every 10 seconds

    return () => clearInterval(interval)
  }, [toast])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "processed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "processed":
        return "default"
      case "failed":
        return "destructive"
      case "pending":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const handleRetryWebhook = async (eventId: string) => {
    setIsProcessing(true)

    // Simulate retry process
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setWebhookEvents((prev) =>
      prev.map((event) =>
        event.id === eventId
          ? {
              ...event,
              status: "processed",
              retryCount: event.retryCount + 1,
              processingTime: Math.floor(Math.random() * 200) + 50,
            }
          : event,
      ),
    )

    setIsProcessing(false)
    toast({
      title: "Webhook Retried",
      description: "Event processed successfully",
    })
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  const processedEvents = webhookEvents.filter((e) => e.status === "processed").length
  const failedEvents = webhookEvents.filter((e) => e.status === "failed").length
  const avgProcessingTime =
    webhookEvents.filter((e) => e.status === "processed").reduce((sum, e) => sum + e.processingTime, 0) /
      processedEvents || 0

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold">Webhook Events</h3>
          <p className="text-gray-600">Real-time events from connected POS systems</p>
        </div>
        <Button variant="outline" disabled={isProcessing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isProcessing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Webhook Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{webhookEvents.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{processedEvents}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{failedEvents}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Processing</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{Math.round(avgProcessingTime)}ms</div>
          </CardContent>
        </Card>
      </div>

      {/* Webhook Events Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Webhook Events</CardTitle>
          <CardDescription>Latest events received from POS systems</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event ID</TableHead>
                  <TableHead>POS System</TableHead>
                  <TableHead>Event Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Processing Time</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {webhookEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">{event.id}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{event.posSystem}</Badge>
                    </TableCell>
                    <TableCell>{event.eventType}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(event.status)}
                        <Badge variant={getStatusColor(event.status) as any}>{event.status}</Badge>
                        {event.retryCount > 0 && (
                          <Badge variant="outline" className="text-xs">
                            Retry {event.retryCount}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{event.status === "processed" ? `${event.processingTime}ms` : "-"}</TableCell>
                    <TableCell className="text-sm">{formatTimestamp(event.timestamp)}</TableCell>
                    <TableCell>
                      {event.status === "failed" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRetryWebhook(event.id)}
                          disabled={isProcessing}
                        >
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Retry
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
