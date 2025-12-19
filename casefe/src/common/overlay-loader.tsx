import Loader from '../components/ui/loader'

const OverlayLoader = () => {
  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.7)] flex items-center justify-center z-5000">
      <Loader />
    </div>
  )
}

export default OverlayLoader
