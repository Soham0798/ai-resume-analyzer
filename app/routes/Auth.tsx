import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter"
import BackgroundLayout from "~/components/BackgroundLayout";

export const meta = () => ([
    {title: 'ResumeAnalyse | Auth'},
    {name: 'description', content: 'Log into your account'},
])

const Auth = () => {
  const { isLoading, auth } = usePuterStore();
  const location  = useLocation();
  const next = location.search.split('next=')[1] || '/';

  const navigate  = useNavigate();

  useEffect(() => {
    const hasNext = location.search.includes('next=');
    if(auth.isAuthenticated && hasNext) navigate(next);
  },[auth.isAuthenticated, next])



  return (
    <BackgroundLayout>
      <main className="min-h-screen flex items-center justify-center">
          <div className="gradient-border shadow-lg">
              <section className=" flex-col gap-8 bg-white rounded-2xl p-10">
                <div className="flex flex-col items-center gap-2 text-center">
                  <h1>Welcome</h1>
                  <h2>Log in to move on to the next step</h2>
                </div>
                <div>
                  {isLoading ? (
                    <button className="auth-button animate-pulse">
                      <p>Signing you in ...</p>
                    </button>
                  ):(
                    <>
                      {auth.isAuthenticated ? (
                        <button className="auth-button" onClick={auth.signOut}>
                          <p>Log Out</p>
                        </button>
                      ):(
                        <button className="auth-button" onClick={auth.signIn}>
                          <p>Log in</p>
                          </button>
                      )}
                    </>
                  )}
                </div>
              </section>
          </div>
      </main>
    </BackgroundLayout>
  )
}

export default Auth