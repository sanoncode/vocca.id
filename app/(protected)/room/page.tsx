import Image from "next/image"

const Page =  () => {
  return (
    
    <div className="flex flex-col items-center h-full justify-center">
        <div className="opacity-20">
          <Image 
          src={'/blank.svg'}
          width="300"
          height="300"
          alt='blank'
          loading="eager"
          className="dark:invert"
          />
          </div>
    </div>
   
  )
}
export default Page