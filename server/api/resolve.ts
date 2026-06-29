export default defineEventHandler(async (event) => {
  const { url } = getQuery(event)

  if (!url || typeof url !== 'string') {
    throw createError({ statusCode: 400, message: 'Missing url parameter' })
  }

  const res = await $fetch.raw(url, {
    redirect: 'follow',
    headers: { 'User-Agent': 'Mozilla/5.0' },
  })

  const finalUrl = res.url
  if (!finalUrl || !/shopee\.com\.my/.test(finalUrl)) {
    throw createError({ statusCode: 422, message: 'Short link did not resolve to a Shopee product page' })
  }

  return { url: finalUrl }
})
