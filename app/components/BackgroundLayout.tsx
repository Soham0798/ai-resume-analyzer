import GradientWaves from "./GradientWaves.jsx";

export default function BackgroundLayout({ children }: { children: React.ReactNode }) {
    return (
        <div style={{ position: "relative", minHeight: "100vh" }}>
            {/* The waves sit behind everything */}
            <div style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: 0,
            }}>
                <GradientWaves
                    horizonColor="#5227FF"
                    waveColor="#FF9FFC"
                    crestColor="#A5F3FC"
                    speed={0.4}
                    amplitude={2.5}
                />
            </div>

            {/* Page content sits on top */}
            <div className="page-transition" style={{ position: "relative", zIndex: 1 }}>
                {children}
            </div>
        </div>
    );
}
