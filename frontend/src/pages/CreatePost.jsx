import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { postsApi } from '../api/posts'
import { getErrorMessage } from '../api/axios'
import { useToast } from '../context/ToastContext'
import Input from '../components/ui/Input'
import Textarea from '../components/ui/Textarea'
import Button from '../components/ui/Button'

export default function CreatePost() {
  const [caption, setCaption] = useState('')
  const [content, setContent] = useState('')
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const fileRef = useRef(null)
  const toast = useToast()
  const navigate = useNavigate()

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImage(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!image) {
      toast.error('Please select an image')
      return
    }
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('caption', caption)
      formData.append('content', content)
      formData.append('image', image)
      await postsApi.create(formData)
      toast.success('Post created!')
      navigate('/')
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto animate-fade-in">
      <h1 className="text-xl font-semibold mb-6">Create New Post</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div
          onClick={() => fileRef.current?.click()}
          className="relative aspect-square rounded-xl border-2 border-dashed border-neutral-300 dark:border-neutral-700 overflow-hidden cursor-pointer hover:border-pink-400 dark:hover:border-pink-500 transition-colors group"
        >
          {preview ? (
            <>
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-sm font-medium">Change image</span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-neutral-400 gap-3">
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022 18.75V5.25A2.25 2.25 0 0019.75 3H4.25A2.25 2.25 0 002 5.25v13.5A2.25 2.25 0 004.25 21z" />
              </svg>
              <span className="text-sm">Click to upload a photo</span>
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
        </div>

        <Input label="Caption" placeholder="Write a caption..." value={caption} onChange={(e) => setCaption(e.target.value)} required />
        <Textarea label="Content" placeholder="What's on your mind?" value={content} onChange={(e) => setContent(e.target.value)} rows={3} required />

        <div className="flex gap-3">
          <Button type="submit" loading={loading} disabled={!image}>Share</Button>
          <Button type="button" variant="secondary" onClick={() => navigate(-1)}>Cancel</Button>
        </div>
      </form>
    </div>
  )
}
