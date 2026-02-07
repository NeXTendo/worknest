import { useState } from 'react'
import { Employee, UserRole } from '@/lib/database.types'
import { ProfileHeader } from './profile-header'
import { PersonalInfo } from './personal-info'
import { EmploymentInfo } from './employment-info'
import { DocumentsInfo } from './documents-info'
import { EmergencyInfo } from './emergency-info'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Shield, User, Briefcase, HeartPulse } from 'lucide-react'

interface ProfileViewProps {
  employee: Employee
  currentUserRole?: UserRole
  onUpdate: () => void
  jobTitle?: string
  department?: string
}

export function ProfileView({ employee, currentUserRole, onUpdate, jobTitle, department }: ProfileViewProps) {
  const [activeTab, setActiveTab] = useState('personal')

  // Check permissions
  const isAdmin = currentUserRole === 'super_admin' || currentUserRole === 'main_admin' || currentUserRole === 'hr_admin'
  const canEditPersonal = true 
  const canEditEmployment = isAdmin

  return (
    <div className="max-w-5xl mx-auto pb-10">
      <ProfileHeader 
        employee={employee} 
        isEditable={canEditPersonal} 
        jobTitle={jobTitle}
      />
      
      <Tabs defaultValue="personal" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:w-auto">
          <TabsTrigger value="personal" className="gap-2">
            <User className="h-4 w-4" />
            Personal
          </TabsTrigger>
          <TabsTrigger value="employment" className="gap-2">
            <Briefcase className="h-4 w-4" />
            Employment
          </TabsTrigger>
          <TabsTrigger value="documents" className="gap-2">
            <FileText className="h-4 w-4" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="emergency" className="gap-2">
            <HeartPulse className="h-4 w-4" />
            Emergency
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <PersonalInfo 
            employee={employee} 
            isEditable={canEditPersonal}
            onUpdate={onUpdate}
          />
        </TabsContent>

        <TabsContent value="employment">
          {canEditEmployment ? (
            <EmploymentInfo 
                employee={employee} 
                isEditable={canEditEmployment}
                onUpdate={onUpdate}
                jobTitleName={jobTitle}
                departmentName={department}
            />
          ) : (
             <Card>
                <CardHeader>
                    <CardTitle>Employment Details</CardTitle>
                    <CardDescription>View your employment information. Contact HR to request changes.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <span className="text-sm font-medium text-slate-500">Employee ID</span>
                            <div className="text-sm">{employee.employee_number}</div>
                        </div>
                        <div>
                            <span className="text-sm font-medium text-slate-500">Job Title</span>
                            <div className="text-sm">
                                {jobTitle || 'N/A'} 
                            </div>
                        </div>
                         <div>
                            <span className="text-sm font-medium text-slate-500">Department</span>
                            <div className="text-sm">
                                {department || 'N/A'}
                            </div>
                        </div>
                        <div>
                            <span className="text-sm font-medium text-slate-500">Hire Date</span>
                            <div className="text-sm">{employee.hire_date}</div>
                        </div>
                    </div>
                </CardContent>
             </Card>
          )}
        </TabsContent>

        <TabsContent value="documents">
            <DocumentsInfo 
                employee={employee} 
                isEditable={canEditPersonal} 
                onUpdate={onUpdate}
            />
        </TabsContent>

        <TabsContent value="emergency">
            <EmergencyInfo 
                employee={employee} 
                isEditable={canEditPersonal} 
                onUpdate={onUpdate}
            />
        </TabsContent>
        
      </Tabs>
    </div>
  )
}
