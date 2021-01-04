export function generateTitle(title) {
    title = title.replace(/\s/g,'').toLowerCase()
    const hasKey = this.$te('route.' + title)
    if (hasKey) {
        const translatedTitle = this.$t('route.' + title)

        return translatedTitle
    }
    return title
}