// Fix for Vercel
if (require.main === module) {
app.listen(process.env.PORT || 3000, () => console.log('running'));
}
module.exports = app;
