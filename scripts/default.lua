-- ============================================
-- AKSHU MODZ - Default Lua Script
-- This script runs after successful key validation
-- ============================================

-- Welcome toast
gg.toast("✅ AKSHU MOD - Script Loaded Successfully!")

-- Example functions - customize as needed
function mainMenu()
    local menu = gg.choice({
        "🔥 Speed Hack",
        "💎 Unlimited Gems", 
        "🛡️ God Mode",
        "❌ Exit"
    }, nil, "🎮 AKSHU MODZ - Select Feature")

    if menu == 1 then
        speedHack()
    elseif menu == 2 then
        unlimitedGems()
    elseif menu == 3 then
        godMode()
    elseif menu == 4 then
        gg.toast("👋 Goodbye!")
        os.exit()
    end
end

function speedHack()
    gg.setSpeed(2.0)
    gg.toast("⚡ Speed Hack Activated!")
end

function unlimitedGems()
    gg.searchNumber("100", gg.TYPE_DWORD)
    gg.getResults(10)
    gg.editAll("999999", gg.TYPE_DWORD)
    gg.toast("💎 Gems Modified!")
end

function godMode()
    gg.searchNumber("100", gg.TYPE_FLOAT)
    gg.getResults(5)
    gg.editAll("99999", gg.TYPE_FLOAT)
    gg.toast("🛡️ God Mode Enabled!")
end

-- Main loop
while true do
    if gg.isVisible(true) then
        gg.setVisible(false)
        mainMenu()
    end
    gg.sleep(100)
end
