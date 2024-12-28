

export default (color="black",weight=1)=>`data:image/svg+xml;base64,${btoa(`
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 9L12 15L18 9" stroke="${color}" stroke-width="${weight}" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`)}`;
