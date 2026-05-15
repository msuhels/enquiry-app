import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/adapters/service-role";

// Fixed zones order
const ZONES = ["north", "south", "east", "west", "central"];

// Map raw level values to display labels
const LEVEL_MAP: Record<string, string> = {
    "1": "Level 1",
    "2": "Level 1",
    "3": "Level 2",
    "4": "Level 3",
    "5": "Level 4",
    "6": "Sales and Marketing",
};

// Fixed display levels order
const LEVELS = ["Level 1", "Level 2", "Level 3", "Level 4", "Sales and Marketing"];

// GET: Fetch analytics for zones and levels
export async function GET() {
    try {
        const supabase = createServiceRoleClient();

        // Get all escalations
        const { data: zoneData, error: zoneError } = await supabase
            .from("escalations")
            .select("zone");

        if (zoneError) {
            console.error("Zone analytics error:", zoneError.message);
        }

        // Get enquiries with their study levels
        const { data: enquiryData, error: enquiryError } = await supabase
            .from("escalations")
            .select("level");

        if (enquiryError) {
            console.error("Enquiry levels error:", enquiryError.message);
        }

        // Process zone analytics - initialize with all 5 zones
        const zoneCounts: Record<string, number> = {};
        ZONES.forEach(zone => {
            zoneCounts[zone] = 0;
        });

        // Count escalations per zone
        if (zoneData) {
            zoneData.forEach((item) => {
                const zone = item.zone?.toLowerCase() || "";
                if (ZONES.includes(zone)) {
                    zoneCounts[zone] = (zoneCounts[zone] || 0) + 1;
                }
            });
        }

        // Convert zone counts to array in fixed order
        const zoneAnalytics = ZONES.map(zone => ({
            zone,
            count: zoneCounts[zone] || 0,
        }));

        // Process level analytics - initialize with display levels
        const levelCounts: Record<string, number> = {};
        LEVELS.forEach(level => {
            levelCounts[level] = 0;
        });

        // Count escalations per level (map raw values to display labels)
        if (enquiryData) {
            enquiryData.forEach((item) => {
                const rawLevel = String(item.level);
                const displayLevel = LEVEL_MAP[rawLevel] || `Level ${rawLevel}`;
                if (displayLevel && LEVELS.includes(displayLevel)) {
                    levelCounts[displayLevel] = (levelCounts[displayLevel] || 0) + 1;
                }
            });
        }

        // Convert level counts to array in fixed order
        const levelAnalytics = LEVELS.map(level => ({
            level: level,
            count: levelCounts[level] || 0,
        }));

        // Calculate totals
        const totalEscalations = zoneAnalytics.reduce((sum, z) => sum + z.count, 0);
        const totalEnquiries = levelAnalytics.reduce((sum, l) => sum + l.count, 0);

        return NextResponse.json({
            success: true,
            data: {
                zones: zoneAnalytics,
                levels: levelAnalytics,
                summary: {
                    totalEscalations,
                    totalEnquiries,
                },
            },
        });
    } catch (error) {
        console.error("Analytics unexpected error:", error);
        return NextResponse.json({
            success: false,
            message: error instanceof Error ? error.message : "Unknown error",
            data: {
                zones: ZONES.map(z => ({ zone: z, count: 0 })),
                levels: LEVELS.map(l => ({ level: l, count: 0 })),
                summary: { totalEscalations: 0, totalEnquiries: 0 },
            },
        });
    }
}
