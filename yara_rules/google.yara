rule google
{
    meta:
        name = "google"

    strings:
        $google = /google/i

    condition:
        all of them
}