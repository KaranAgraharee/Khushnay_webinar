export const Testimonial = [
  {
    id:1,
    url:'https://youtube.com/shorts/lKjbS77FSzw?si=YsddKa_6ojElEyvy',
  },
  {
    id:2,
    url:'https://youtube.com/shorts/FRNNDJNxo6g?si=mCmhXaqRMu_z7bwe'
  },
  {
    id:3,
    url:'https://youtube.com/shorts/Q0oF8ALNh9s?si=x7BkEAbpqeXxuPEy'
  },
  {
    id:4,
    url:'https://youtube.com/shorts/Lw9hGOrIk4g?si=FWlRKcGxquMDu9d-'
  },
  {
    id:5,
    url:'https://youtube.com/shorts/pMpMtC1oLbI?si=pLKT-YodMUrEArqm'
  },
  {
    id:6,
    url:'https://youtube.com/shorts/SSwd8ZanhA4?si=eywLh0G8fjnh8WJ1'
  },
  {
    id:7,
    url:'https://youtube.com/shorts/EXwwt2-JT_c?si=1OiHjjr7PLdVXQ2w'
  },
  {
    id:8,
    url:'https://youtube.com/shorts/ZK_IRp-TR9c?si=MSVJeXq87EsX3Oz7'
  },
  {
    id:9,
    url:'https://youtube.com/shorts/TMb5-7S_Zvs?si=kt1IHH90_vM5fysf'
  },

]

export const getYouTubeEmbedUrl = (url) => {
  const shortsMatch = url.match(/youtube\.com\/shorts\/([^?&/]+)/)
  if (shortsMatch) return `https://www.youtube.com/embed/${shortsMatch[1]}`

  const watchMatch = url.match(/[?&]v=([^&]+)/)
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`

  const shortLinkMatch = url.match(/youtu\.be\/([^?&/]+)/)
  if (shortLinkMatch) return `https://www.youtube.com/embed/${shortLinkMatch[1]}`

  return null
}

export const testimonialNote =
  '* Testimonials reflect real experiences shared by past attendees.'
