import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Camera, Mail, User, FileText, Save, Trash2, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/FormElements';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Modal } from '../components/ui/LoadingStates';

const ProfilePage: React.FC = () => {
  const { user, updateUser, logout } = useAuth();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(user?.avatar || '');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [deleteModal, setDeleteModal] = useState(false);

  const updateMutation = useMutation({
    mutationFn: () => {
      const fd = new FormData();
      fd.append('name', name);
      fd.append('bio', bio);
      if (avatar) fd.append('avatar', avatar);
      return authService.updateProfile(fd);
    },
    onSuccess: (res) => {
      updateUser(res.data.user);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    },
    onError: (err: any) => setError(err.response?.data?.message || 'Update failed'),
  });

  const deleteMutation = useMutation({
    mutationFn: () => authService.deleteAccount(),
    onSuccess: () => logout(),
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const avatarSrc = previewUrl
    ? (previewUrl.startsWith('blob:') ? previewUrl : `http://localhost:5000${previewUrl}`)
    : '';

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your account settings</p>
      </div>

      {success && <div className="p-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-xl text-sm">{success}</div>}
      {error && <div className="p-4 bg-destructive/10 text-destructive rounded-xl text-sm">{error}</div>}

      {/* Avatar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                {avatarSrc ? (
                  <img src={avatarSrc} alt={name} className="w-full h-full object-cover" />
                ) : (
                  name?.charAt(0).toUpperCase()
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white shadow-lg hover:bg-primary/90 transition-colors"
              >
                <Camera size={14} />
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{user?.name}</h2>
              <p className="text-muted-foreground text-sm">{user?.email}</p>
              <p className="text-muted-foreground text-xs mt-1">Click the camera icon to change photo</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info Form */}
      <Card>
        <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Input label="Full Name" value={name} onChange={e => setName(e.target.value)} icon={<User size={16}/>} />
          <Input label="Email" value={user?.email || ''} readOnly icon={<Mail size={16}/>} className="opacity-60 cursor-not-allowed"/>
          <Textarea label="Bio" placeholder="Tell us about yourself..." value={bio} onChange={e => setBio(e.target.value)} rows={3}/>
          <Button onClick={() => updateMutation.mutate()} disabled={updateMutation.isPending} className="w-full sm:w-auto">
            <Save size={16}/> {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/50">
        <CardHeader><CardTitle className="text-destructive">Danger Zone</CardTitle></CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm mb-4">Once you delete your account, there is no going back.</p>
          <Button variant="destructive" onClick={() => setDeleteModal(true)}>
            <Trash2 size={16}/> Delete Account
          </Button>
        </CardContent>
      </Card>

      <Modal isOpen={deleteModal} onClose={() => setDeleteModal(false)} title="Delete Account">
        <div className="space-y-4">
          <p className="text-muted-foreground">This will permanently delete your account and all your trip data. Are you absolutely sure?</p>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setDeleteModal(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteMutation.mutate()} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? 'Deleting...' : 'Yes, Delete Everything'}
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};

export default ProfilePage;
