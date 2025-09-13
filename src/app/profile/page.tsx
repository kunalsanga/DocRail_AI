"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Calendar,
  Save,
  Edit,
  ArrowLeft,
  Camera
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@kmrl.com",
    phone: "+91 98765 43210",
    department: "Operations",
    designation: "Senior Manager",
    employeeId: "KMRL001234",
    joiningDate: "2020-01-15",
    address: "Kochi, Kerala, India",
    bio: "Experienced professional in metro rail operations with expertise in safety protocols and team management."
  });
  const { user, logout } = useAuth();
  const router = useRouter();

  const departments = [
    "Corporate Affairs",
    "Architecture & Planning", 
    "Operations",
    "Finance",
    "Project Management",
    "Environment",
    "Commercial",
    "IT"
  ];

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to backend
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        {/* Header */}
        <header className="bg-white shadow-lg border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  onClick={() => router.back()}
                  className="hover:bg-gray-100"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <User className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">User Profile</h1>
                  <p className="text-sm text-gray-600">KMRL Document Hub</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  variant={isEditing ? "outline" : "default"}
                  className={isEditing ? "" : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  {isEditing ? "Cancel" : "Edit Profile"}
                </Button>
                <Button variant="ghost" onClick={logout} className="hover:bg-gray-100">
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <Card className="shadow-lg border-0">
                <CardContent className="p-8 text-center">
                  <div className="relative inline-block">
                    <Avatar className="w-32 h-32 mx-auto mb-4">
                      <AvatarImage src="/api/placeholder/128/128" />
                      <AvatarFallback className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                        {profileData.firstName[0]}{profileData.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <Button
                        size="sm"
                        className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0 bg-blue-600 hover:bg-blue-700"
                      >
                        <Camera className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {profileData.firstName} {profileData.lastName}
                  </h2>
                  <p className="text-gray-600 mb-1">{profileData.designation}</p>
                  <p className="text-sm text-gray-500 mb-4">{profileData.department}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-center space-x-2 text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span>{profileData.email}</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 text-gray-600">
                      <Building className="w-4 h-4" />
                      <span>ID: {profileData.employeeId}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Profile Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-t-lg">
                  <CardTitle className="text-xl font-bold text-gray-900">Personal Information</CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-sm font-semibold">First Name</Label>
                      <Input
                        id="firstName"
                        value={profileData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        disabled={!isEditing}
                        className="border-2 border-gray-200 rounded-xl focus:border-blue-500 disabled:bg-gray-50"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-sm font-semibold">Last Name</Label>
                      <Input
                        id="lastName"
                        value={profileData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        disabled={!isEditing}
                        className="border-2 border-gray-200 rounded-xl focus:border-blue-500 disabled:bg-gray-50"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-semibold">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        disabled={!isEditing}
                        className="border-2 border-gray-200 rounded-xl focus:border-blue-500 disabled:bg-gray-50"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-semibold">Phone</Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        disabled={!isEditing}
                        className="border-2 border-gray-200 rounded-xl focus:border-blue-500 disabled:bg-gray-50"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-sm font-semibold">Address</Label>
                      <Input
                        id="address"
                        value={profileData.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        disabled={!isEditing}
                        className="border-2 border-gray-200 rounded-xl focus:border-blue-500 disabled:bg-gray-50"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="joiningDate" className="text-sm font-semibold">Joining Date</Label>
                      <Input
                        id="joiningDate"
                        type="date"
                        value={profileData.joiningDate}
                        onChange={(e) => handleInputChange("joiningDate", e.target.value)}
                        disabled={!isEditing}
                        className="border-2 border-gray-200 rounded-xl focus:border-blue-500 disabled:bg-gray-50"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Professional Information */}
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-t-lg">
                  <CardTitle className="text-xl font-bold text-gray-900">Professional Information</CardTitle>
                  <CardDescription>Update your work-related details</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="department" className="text-sm font-semibold">Department</Label>
                      <Select 
                        value={profileData.department} 
                        onValueChange={(value) => handleInputChange("department", value)}
                        disabled={!isEditing}
                      >
                        <SelectTrigger className="border-2 border-gray-200 rounded-xl focus:border-blue-500 disabled:bg-gray-50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept} value={dept}>
                              {dept}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="designation" className="text-sm font-semibold">Designation</Label>
                      <Input
                        id="designation"
                        value={profileData.designation}
                        onChange={(e) => handleInputChange("designation", e.target.value)}
                        disabled={!isEditing}
                        className="border-2 border-gray-200 rounded-xl focus:border-blue-500 disabled:bg-gray-50"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="employeeId" className="text-sm font-semibold">Employee ID</Label>
                      <Input
                        id="employeeId"
                        value={profileData.employeeId}
                        onChange={(e) => handleInputChange("employeeId", e.target.value)}
                        disabled={!isEditing}
                        className="border-2 border-gray-200 rounded-xl focus:border-blue-500 disabled:bg-gray-50"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-2">
                    <Label htmlFor="bio" className="text-sm font-semibold">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      disabled={!isEditing}
                      rows={4}
                      className="border-2 border-gray-200 rounded-xl focus:border-blue-500 disabled:bg-gray-50"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Save Button */}
              {isEditing && (
                <div className="flex justify-end">
                  <Button
                    onClick={handleSave}
                    className="px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
