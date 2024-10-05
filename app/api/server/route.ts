import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { MemberRole } from "@prisma/client";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { name, imageUrl, categoryIds } = await req.json();
    console.log(categoryIds); // Add this to confirm data is received

    const profile = await currentProfile();

    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    const server = await db.server.create({
      data: {
        profileId: profile.id,
        name,
        imageUrl,
        inviteCode: uuidv4(),
        channels: { create: [{ name: "general", profileId: profile.id }] },
        members: { create: [{ profileId: profile.id, role: MemberRole.ADMIN }] },
      }
    });

    // TODO: Have to fix this
    if (categoryIds && Array.isArray(categoryIds)) {
      const categoryPromises = categoryIds.map(async (categoryId: number) => {
        return db.joinCategoryServer.create({
          data: {
            serverId: server.id,       
            categoryId: categoryId,     
          }
        });
      });

      await Promise.all(categoryPromises); 
    }

    return NextResponse.json(server);
  } catch (error) {
    console.error("[SERVERS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
