import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { postsApi } from '../api/posts'
import { getErrorMessage } from '../api/axios'
import { useToast } from '../context/ToastContext'
import Input from '../components/ui/Input'
import Textarea from '../components/ui/Textarea'
import Button from '../components/ui/Button'
import { PageLoader } from '../components/ui/Spinner'

export default function UpdatePost() {
  const { postId } = useParams()
  const [caption, setCaption] = useState('')
  const [content, setContent] = useState('')
  const [currentImage, setCurrentImage] = useState('')
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const fileRef = useRef(null)
  const toast = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await postsApi.getById(postId)
        if (!data) {
          toast.error('Post not found')
          navigate('/')
          return
        }
        setCaption(data.caption || '')
        setContent(data.content || '')
        setCurrentImage(data.image_url)
      } catch (err) {
        toast.error(getErrorMessage(err))
        navigate('/')
      } finally {
        setLoading(false)
      }
    }
    fetchPost()
  }, [postId])

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImage(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const formData = new FormData()
      if (caption) formData.append('caption', caption)
      if (content) formData.append('content', content)
      if (image) formData.append('image', image)
      await postsApi.update(postId, formData)
      toast.success('Post updated!')
      navigate('/')
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <PageLoader />

  const displayImage = preview || currentImage

  return (
    <div className="max-w-lg mx-auto animate-fade-in">
      <h1 className="text-xl font-semibold mb-6">Edit Post</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div
          onClick={() => fileRef.current?.click()}
          className="relative aspect-square rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden cursor-pointer group"
        >
          {displayImage ? (
            <>
              <img src={displayImage} alt="Post" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-sm font-medium">Change image</span>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-neutral-400 text-sm">No image</div>
          )}
          <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
        </div>

        <Input label="Caption" value={caption} onChange={(e) => setCaption(e.target.value)} />
        <Textarea label="Content" value={content} onChange={(e) => setContent(e.target.value)} rows={3} />

        <div className="flex gap-3">
          <Button type="submit" loading={saving}>Save changes</Button>
          <Button type="button" variant="secondary" onClick={() => navigate(-1)}>Cancel</Button>
        </div>
      </form>
    </div>
  )
}
