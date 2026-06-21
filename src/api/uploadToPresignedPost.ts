const UPLOAD_FILE_FIELD = 'file'

export async function uploadToPresignedPost(
  url: string,
  fields: Record<string, string>,
  file: File,
): Promise<void> {
  const form = new FormData()
  Object.entries(fields).forEach(([name, value]) => form.append(name, value))
  form.append(UPLOAD_FILE_FIELD, file)

  const res = await fetch(url, { method: 'POST', body: form })
  if (!res.ok) throw new Error(`Upload failed: ${res.status}`)
}
