import { useEffect } from "react"
import { callApi } from "../../apis/api"

export function Home(){
  useEffect(() => {
    const test =  async () => {
      const response = await callApi.post("/users/test")
      return response
    }
    test().then(res=>
      console.log(res)
    )
  },[])
  return <div    
  className="main-page">
    a
  </div>
}