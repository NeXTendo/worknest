'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Employee } from '@/lib/database.types'
import { Plus, Trash2, FileText, ExternalLink } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { updateRecord } from '@/lib/supabase/rpc-helpers'
import { useToast } from '@/hooks/useToast'
import { format } from 'date-fns'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface DocumentsInfoProps {
  employee: Employee
  isEditable: boolean
  onUpdate: () => void
}

type DocumentItem = {
  id: string
  name: string
  type: string
  url?: string
  notes?: string
  uploaded_at: string
}

export function DocumentsInfo({ employee, isEditable, onUpdate }: DocumentsInfoProps) {
  const [loading, setLoading] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  
  // Safe cast for documents JSON
  const documents: DocumentItem[] = Array.isArray(employee.documents) 
    ? (employee.documents as any[]).map(d => ({...d})) 
    : []

  const supabase = createClient()
  const { toast } = useToast()

  const [newDoc, setNewDoc] = useState<Partial<DocumentItem>>({
    name: '',
    type: 'Qualification',
    notes: ''
  })

  const handleAddDocument = async () => {
    if (!newDoc.name) return

    try {
      setLoading(true)
      
      const docToAdd: DocumentItem = {
        id: crypto.randomUUID(),
        name: newDoc.name,
        type: newDoc.type || 'Other',
        notes: newDoc.notes,
        uploaded_at: new Date().toISOString(),
        url: newDoc.url
      }

      const updatedDocs = [...documents, docToAdd]

      const { error } = await updateRecord(
        supabase,
        'employees',
        employee.id,
        { documents: updatedDocs }
      )
      
      if (error) throw error

      toast({
        title: 'Document Added',
        description: 'New document record added successfully.',
      })
      
      setIsAddDialogOpen(false)
      setNewDoc({ name: '', type: 'Qualification', notes: '' })
      onUpdate()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteDocument = async (id: string) => {
    if (!confirm('Are you sure you want to remove this document record?')) return

    try {
      setLoading(true)
      const updatedDocs = documents.filter(d => d.id !== id)

      const { error } = await updateRecord(
        supabase,
        'employees',
        employee.id,
        { documents: updatedDocs }
      )
      
      if (error) throw error

      toast({
        title: 'Document Removed',
        description: 'Document record removed successfully.',
      })
      
      onUpdate()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Documents & Qualifications</CardTitle>
          <CardDescription>Manage certifications, contracts, and other records</CardDescription>
        </div>
        {isEditable && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
                <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Record
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Document Record</DialogTitle>
                    <DialogDescription>Add details about a qualification or document.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Name / Title</Label>
                        <Input 
                            placeholder="e.g. BSc Computer Science" 
                            value={newDoc.name} 
                            onChange={e => setNewDoc({...newDoc, name: e.target.value})} 
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Type</Label>
                        <Select 
                            value={newDoc.type} 
                            onValueChange={val => setNewDoc({...newDoc, type: val})}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Qualification">Qualification</SelectItem>
                                <SelectItem value="Certification">Certification</SelectItem>
                                <SelectItem value="Contract">Contract</SelectItem>
                                <SelectItem value="ID">Identification</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Link / URL (Optional)</Label>
                        <Input 
                            placeholder="https://..." 
                            value={newDoc.url} 
                            onChange={e => setNewDoc({...newDoc, url: e.target.value})} 
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Notes</Label>
                        <Input 
                            placeholder="Optional notes or details" 
                            value={newDoc.notes} 
                            onChange={e => setNewDoc({...newDoc, notes: e.target.value})} 
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddDocument} disabled={!newDoc.name || loading}>Add Record</Button>
                </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent>
        {documents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center space-y-3">
                <FileText className="h-12 w-12 text-slate-200" />
                <p className="text-slate-500">No documents or qualifications recorded.</p>
            </div>
        ) : (
            <div className="space-y-4">
                {documents.map((doc) => (
                    <div key={doc.id} className="flex items-start justify-between p-4 border rounded-lg bg-slate-50/50">
                        <div className="flex gap-3">
                            <div className="mt-1 bg-white p-2 rounded border shadow-sm text-worknest-teal">
                                <FileText className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="font-medium text-slate-900">{doc.name}</h4>
                                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                    <span className="bg-slate-200 px-1.5 py-0.5 rounded capitalize">{doc.type}</span>
                                    <span>Added {format(new Date(doc.uploaded_at), 'MMM d, yyyy')}</span>
                                </div>
                                {doc.notes && <p className="text-sm text-slate-600 mt-1">{doc.notes}</p>}
                                {doc.url && (
                                    <a href={doc.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-blue-600 hover:underline mt-1">
                                        View Document <ExternalLink className="h-3 w-3" />
                                    </a>
                                )}
                            </div>
                        </div>
                        {isEditable && (
                            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-500" onClick={() => handleDeleteDocument(doc.id)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                ))}
            </div>
        )}
      </CardContent>
    </Card>
  )
}
