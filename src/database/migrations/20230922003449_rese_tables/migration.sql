-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "first_name" TEXT,
    "password" TEXT NOT NULL,
    "last_name" TEXT,
    "phone_number" TEXT,
    "business_name" TEXT,
    "days_of_business" TEXT,
    "occupation" TEXT,
    "hours_of_business_open" TEXT,
    "hours_of_business_close" TEXT,
    "website" TEXT,
    "license" TEXT,
    "avatar" TEXT,
    "bio" TEXT,
    "role" TEXT NOT NULL DEFAULT 'tenant',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
