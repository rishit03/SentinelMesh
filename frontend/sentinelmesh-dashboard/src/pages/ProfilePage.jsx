import React, { useState, useEffect } from 'react';
import { 
  User, 
  Save, 
  Eye, 
  EyeOff, 
  Shield, 
  Building, 
  Mail,
  Calendar,
  Settings
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { toast } from 'sonner';

const ProfilePage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    org: ''
  });

  // Get current user info from token
  const getCurrentUserFromToken = () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload;
      }
    } catch (error) {
      console.error('Error parsing token:', error);
    }
    return null;
  };

  // Fetch current user info from API
  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/users/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserInfo(data);
        setFormData({
          username: data.username,
          password: '',
          org: data.org
        });
      } else {
        throw new Error('Failed to fetch user info');
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
        toast.error("Failed to fetch user information. Please try again.")
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const updateData = { ...formData };
      
      // Don't send empty password
      if (!updateData.password) {
        delete updateData.password;
      }

      const response = await fetch('/api/users/me', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUserInfo(updatedUser);
        setFormData({
          username: updatedUser.username,
          password: '',
          org: updatedUser.org
        });
        
        toast.success("Profile updated successfully.");

        // If username changed, we might need to refresh the token
        if (updatedUser.username !== userInfo.username) {
          toast.info("Please log in again with your new username.");
          // Optionally redirect to login
          setTimeout(() => {
            localStorage.removeItem('token');
            window.location.href = '/login';
          }, 2000);
        }
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.message || "Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const tokenUser = getCurrentUserFromToken();

  useEffect(() => {
    fetchUserInfo();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading profile...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Profile Settings</h1>
          <p className="text-muted-foreground">
            Manage your account information and preferences
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="h-10 w-10 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{userInfo?.username}</h3>
                <p className="text-sm text-muted-foreground">{userInfo?.org}</p>
              </div>
              <Badge variant={userInfo?.role === 'admin' ? 'destructive' : 'secondary'}>
                {userInfo?.role === 'admin' ? (
                  <>
                    <Shield className="h-3 w-3 mr-1" />
                    Administrator
                  </>
                ) : (
                  <>
                    <User className="h-3 w-3 mr-1" />
                    User
                  </>
                )}
              </Badge>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Organization:</span>
                <span className="font-medium">{userInfo?.org}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Role:</span>
                <span className="font-medium capitalize">{userInfo?.role}</span>
              </div>
              {tokenUser?.exp && (
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Token expires:</span>
                  <span className="font-medium text-xs">
                    {new Date(tokenUser.exp * 1000).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Profile Settings */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Account Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="Enter username"
                />
                <p className="text-xs text-muted-foreground">
                  Changing your username will require you to log in again.
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="org">Organization</Label>
                <Input
                  id="org"
                  value={formData.org}
                  onChange={(e) => setFormData({ ...formData, org: e.target.value })}
                  placeholder="Enter organization"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Enter new password (leave empty to keep current)"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Leave empty to keep your current password.
                </p>
              </div>

              <div className="grid gap-2">
                <Label>Role</Label>
                <div className="p-3 bg-muted rounded-md">
                  <Badge variant={userInfo?.role === 'admin' ? 'destructive' : 'secondary'}>
                    {userInfo?.role === 'admin' ? (
                      <>
                        <Shield className="h-3 w-3 mr-1" />
                        Administrator
                      </>
                    ) : (
                      <>
                        <User className="h-3 w-3 mr-1" />
                        User
                      </>
                    )}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    Contact an administrator to change your role.
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="flex justify-end">
              <Button 
                onClick={updateProfile} 
                disabled={saving}
                className="flex items-center gap-2"
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                Account Security
              </h4>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Use a strong, unique password for your account</li>
                <li>• Keep your login credentials secure and don't share them</li>
                <li>• Log out when using shared or public computers</li>
                <li>• Report any suspicious activity to your administrator</li>
              </ul>
            </div>
            
            {userInfo?.role === 'admin' && (
              <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                <h4 className="font-medium text-red-900 dark:text-red-100 mb-2">
                  Administrator Privileges
                </h4>
                <p className="text-sm text-red-800 dark:text-red-200">
                  As an administrator, you have elevated privileges including user management, 
                  system configuration, and access to sensitive data. Please use these 
                  privileges responsibly and in accordance with your organization's policies.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;

