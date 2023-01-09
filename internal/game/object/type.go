package object

type Name int

const (
	NotApplicable                        Name = -1
	TestData1                            Name = 0
	Casket5                              Name = 1
	Shrine                               Name = 2
	Casket6                              Name = 3
	LargeUrn1                            Name = 4
	LargeChestRight                      Name = 5
	LargeChestLeft                       Name = 6
	Barrel                               Name = 7
	TowerTome                            Name = 8
	Urn2                                 Name = 9
	Bench                                Name = 10
	BarrelExploding                      Name = 11
	RogueFountain                        Name = 12
	DoorGateLeft                         Name = 13
	DoorGateRight                        Name = 14
	DoorWoodenLeft                       Name = 15
	DoorWoodenRight                      Name = 16
	CairnStoneAlpha                      Name = 17
	CairnStoneBeta                       Name = 18
	CairnStoneGamma                      Name = 19
	CairnStoneDelta                      Name = 20
	CairnStoneLambda                     Name = 21
	CairnStoneTheta                      Name = 22
	DoorCourtyardLeft                    Name = 23
	DoorCourtyardRight                   Name = 24
	DoorCathedralDouble                  Name = 25
	CainGibbet                           Name = 26
	DoorMonasteryDoubleRight             Name = 27
	HoleAnim                             Name = 28
	Brazier                              Name = 29
	InifussTree                          Name = 30
	Fountain                             Name = 31
	Crucifix                             Name = 32
	Candles1                             Name = 33
	Candles2                             Name = 34
	Standard1                            Name = 35
	Standard2                            Name = 36
	Torch1Tiki                           Name = 37
	Torch2Wall                           Name = 38
	RogueBonfire                         Name = 39
	River1                               Name = 40
	River2                               Name = 41
	River3                               Name = 42
	River4                               Name = 43
	River5                               Name = 44
	AmbientSoundGenerator                Name = 45
	Crate                                Name = 46
	AndarielDoor                         Name = 47
	RogueTorch1                          Name = 48
	RogueTorch2                          Name = 49
	CasketR                              Name = 50
	CasketL                              Name = 51
	Urn3                                 Name = 52
	Casket                               Name = 53
	RogueCorpse1                         Name = 54
	RogueCorpse2                         Name = 55
	RogueCorpseRolling                   Name = 56
	CorpseOnStick1                       Name = 57
	CorpseOnStick2                       Name = 58
	TownPortal                           Name = 59
	PermanentTownPortal                  Name = 60
	InvisibleObject                      Name = 61
	DoorCathedralLeft                    Name = 62
	DoorCathedralRight                   Name = 63
	DoorWoodenLeft2                      Name = 64
	InvisibleRiverSound1                 Name = 65
	InvisibleRiverSound2                 Name = 66
	Ripple1                              Name = 67
	Ripple2                              Name = 68
	Ripple3                              Name = 69
	Ripple4                              Name = 70
	ForestNightSound1                    Name = 71
	ForestNightSound2                    Name = 72
	YetiDung                             Name = 73
	TrappDoor                            Name = 74
	DoorByAct2Dock                       Name = 75
	SewerDrip                            Name = 76
	HealthOrama                          Name = 77
	InvisibleTownSound                   Name = 78
	Casket3                              Name = 79
	Obelisk                              Name = 80
	ForestAltar                          Name = 81
	BubblingPoolOfBlood                  Name = 82
	HornShrine                           Name = 83
	HealingWell                          Name = 84
	BullHealthShrine                     Name = 85
	SteleDesertMagicShrine               Name = 86
	TombLargeChestL                      Name = 87
	TombLargeChestR                      Name = 88
	Sarcophagus                          Name = 89
	DesertObelisk                        Name = 90
	TombDoorLeft                         Name = 91
	TombDoorRight                        Name = 92
	InnerHellManaShrine                  Name = 93
	LargeUrn4                            Name = 94
	LargeUrn5                            Name = 95
	InnerHellHealthShrine                Name = 96
	InnerHellShrine                      Name = 97
	TombDoorLeft2                        Name = 98
	TombDoorRight2                       Name = 99
	DurielsLairPortal                    Name = 100
	Brazier3                             Name = 101
	FloorBrazier                         Name = 102
	Flies                                Name = 103
	ArmorStandRight                      Name = 104
	ArmorStandLeft                       Name = 105
	WeaponRackRight                      Name = 106
	WeaponRackLeft                       Name = 107
	Malus                                Name = 108
	PalaceHealthShrine                   Name = 109
	Drinker                              Name = 110
	Fountain1                            Name = 111
	Gesturer                             Name = 112
	DesertFountain                       Name = 113
	Turner                               Name = 114
	Fountain3                            Name = 115
	SnakeWomanShrine                     Name = 116
	JungleTorch                          Name = 117
	Fountain4                            Name = 118
	WaypointPortal                       Name = 119
	DungeonHealthShrine                  Name = 120
	JerhynPlaceHolder1                   Name = 121
	JerhynPlaceHolder2                   Name = 122
	InnerHellShrine2                     Name = 123
	InnerHellShrine3                     Name = 124
	InnerHellHiddenStash                 Name = 125
	InnerHellSkullPile                   Name = 126
	InnerHellHiddenStash2                Name = 127
	InnerHellHiddenStash3                Name = 128
	SecretDoor1                          Name = 129
	Act1WildernessWell                   Name = 130
	VileDogAfterglow                     Name = 131
	CathedralWell                        Name = 132
	ArcaneSanctuaryShrine                Name = 133
	DesertShrine2                        Name = 134
	DesertShrine3                        Name = 135
	DesertShrine1                        Name = 136
	DesertWell                           Name = 137
	CaveWell                             Name = 138
	Act1LargeChestRight                  Name = 139
	Act1TallChestRight                   Name = 140
	Act1MediumChestRight                 Name = 141
	DesertJug1                           Name = 142
	DesertJug2                           Name = 143
	Act1LargeChest1                      Name = 144
	InnerHellWaypoint                    Name = 145
	Act2MediumChestRight                 Name = 146
	Act2LargeChestRight                  Name = 147
	Act2LargeChestLeft                   Name = 148
	TaintedSunAltar                      Name = 149
	DesertShrine5                        Name = 150
	DesertShrine4                        Name = 151
	HoradricOrifice                      Name = 152
	TyraelsDoor                          Name = 153
	GuardCorpse                          Name = 154
	HiddenStashRock                      Name = 155
	Act2Waypoint                         Name = 156
	Act1WildernessWaypoint               Name = 157
	SkeletonCorpseIsAnOxymoron           Name = 158
	HiddenStashRockB                     Name = 159
	SmallFire                            Name = 160
	MediumFire                           Name = 161
	LargeFire                            Name = 162
	Act1CliffHidingSpot                  Name = 163
	ManaWell1                            Name = 164
	ManaWell2                            Name = 165
	ManaWell3                            Name = 166
	ManaWell4                            Name = 167
	ManaWell5                            Name = 168
	HollowLog                            Name = 169
	JungleHealWell                       Name = 170
	SkeletonCorpseIsStillAnOxymoron      Name = 171
	DesertHealthShrine                   Name = 172
	ManaWell7                            Name = 173
	LooseRock                            Name = 174
	LooseBoulder                         Name = 175
	MediumChestLeft                      Name = 176
	LargeChestLeft2                      Name = 177
	GuardCorpseOnAStick                  Name = 178
	Bookshelf1                           Name = 179
	Bookshelf2                           Name = 180
	JungleChest                          Name = 181
	TombCoffin                           Name = 182
	JungleMediumChestLeft                Name = 183
	JungleShrine2                        Name = 184
	JungleStashObject1                   Name = 185
	JungleStashObject2                   Name = 186
	JungleStashObject3                   Name = 187
	JungleStashObject4                   Name = 188
	DummyCainPortal                      Name = 189
	JungleShrine3                        Name = 190
	JungleShrine4                        Name = 191
	TeleportationPad1                    Name = 192
	LamEsensTome                         Name = 193
	StairsL                              Name = 194
	StairsR                              Name = 195
	FloorTrap                            Name = 196
	JungleShrine5                        Name = 197
	TallChestLeft                        Name = 198
	MephistoShrine1                      Name = 199
	MephistoShrine2                      Name = 200
	MephistoShrine3                      Name = 201
	MephistoManaShrine                   Name = 202
	MephistoLair                         Name = 203
	StashBox                             Name = 204
	StashAltar                           Name = 205
	MafistoHealthShrine                  Name = 206
	Act3WaterRocks                       Name = 207
	Basket1                              Name = 208
	Basket2                              Name = 209
	Act3WaterLogs                        Name = 210
	Act3WaterRocksGirl                   Name = 211
	Act3WaterBubbles                     Name = 212
	Act3WaterLogsX                       Name = 213
	Act3WaterRocksB                      Name = 214
	Act3WaterRocksGirlC                  Name = 215
	Act3WaterRocksY                      Name = 216
	Act3WaterLogsZ                       Name = 217
	WebCoveredTree1                      Name = 218
	WebCoveredTree2                      Name = 219
	WebCoveredTree3                      Name = 220
	WebCoveredTree4                      Name = 221
	Pillar                               Name = 222
	Cocoon                               Name = 223
	Cocoon2                              Name = 224
	SkullPileH1                          Name = 225
	OuterHellShrine                      Name = 226
	Act3WaterRocksGirlW                  Name = 227
	Act3BigLog                           Name = 228
	SlimeDoor1                           Name = 229
	SlimeDoor2                           Name = 230
	OuterHellShrine2                     Name = 231
	OuterHellShrine3                     Name = 232
	PillarH2                             Name = 233
	Act3BigLogC                          Name = 234
	Act3BigLogD                          Name = 235
	HellHealthShrine                     Name = 236
	Act3TownWaypoint                     Name = 237
	WaypointH                            Name = 238
	BurningBodyTown                      Name = 239
	Gchest1L                             Name = 240
	Gchest2R                             Name = 241
	Gchest3R                             Name = 242
	GLchest3L                            Name = 243
	SewersRatNest                        Name = 244
	BurningBodyTown2                     Name = 245
	SewersRatNest2                       Name = 246
	Act1BedBed1                          Name = 247
	Act1BedBed2                          Name = 248
	HellManaShrine                       Name = 249
	ExplodingCow                         Name = 250
	GidbinnAltar                         Name = 251
	GidbinnAltarDecoy                    Name = 252
	DiabloRightLight                     Name = 253
	DiabloLeftLight                      Name = 254
	DiabloStartPoint                     Name = 255
	Act1CabinStool                       Name = 256
	Act1CabinWood                        Name = 257
	Act1CabinWood2                       Name = 258
	HellSkeletonSpawnNW                  Name = 259
	Act1HolyShrine                       Name = 260
	TombsFloorTrapSpikes                 Name = 261
	Act1CathedralShrine                  Name = 262
	Act1JailShrine1                      Name = 263
	Act1JailShrine2                      Name = 264
	Act1JailShrine3                      Name = 265
	MaggotLairGooPile                    Name = 266
	Bank                                 Name = 267
	WirtCorpse                           Name = 268
	GoldPlaceHolder                      Name = 269
	GuardCorpse2                         Name = 270
	DeadVillager1                        Name = 271
	DeadVillager2                        Name = 272
	DummyFlameNoDamage                   Name = 273
	TinyPixelShapedThingie               Name = 274
	CavesHealthShrine                    Name = 275
	CavesManaShrine                      Name = 276
	CaveMagicShrine                      Name = 277
	Act3DungeonManaShrine                Name = 278
	Act3SewersMagicShrine1               Name = 279
	Act3SewersHealthWell                 Name = 280
	Act3SewersManaWell                   Name = 281
	Act3SewersMagicShrine2               Name = 282
	Act2BrazierCeller                    Name = 283
	Act2TombAnubisCoffin                 Name = 284
	Act2Brazier                          Name = 285
	Act2BrazierTall                      Name = 286
	Act2BrazierSmall                     Name = 287
	Act2CellerWaypoint                   Name = 288
	HarumBedBed                          Name = 289
	IronGrateDoorLeft                    Name = 290
	IronGrateDoorRight                   Name = 291
	WoodenGrateDoorLeft                  Name = 292
	WoodenGrateDoorRight                 Name = 293
	WoodenDoorLeft                       Name = 294
	WoodenDoorRight                      Name = 295
	TombsWallTorchLeft                   Name = 296
	TombsWallTorchRight                  Name = 297
	ArcaneSanctuaryPortal                Name = 298
	Act2HaramMagicShrine1                Name = 299
	Act2HaramMagicShrine2                Name = 300
	MaggotHealthWell                     Name = 301
	MaggotManaWell                       Name = 302
	ArcaneSanctuaryMagicShrine           Name = 303
	TeleportationPad2                    Name = 304
	TeleportationPad3                    Name = 305
	TeleportationPad4                    Name = 306
	DummyArcaneThing1                    Name = 307
	DummyArcaneThing2                    Name = 308
	DummyArcaneThing3                    Name = 309
	DummyArcaneThing4                    Name = 310
	DummyArcaneThing5                    Name = 311
	DummyArcaneThing6                    Name = 312
	DummyArcaneThing7                    Name = 313
	HaremDeadGuard1                      Name = 314
	HaremDeadGuard2                      Name = 315
	HaremDeadGuard3                      Name = 316
	HaremDeadGuard4                      Name = 317
	HaremEunuchBlocker                   Name = 318
	ArcaneHealthWell                     Name = 319
	ArcaneManaWell                       Name = 320
	TestData2                            Name = 321
	Act2TombWell                         Name = 322
	Act2SewerWaypoint                    Name = 323
	Act3TravincalWaypoint                Name = 324
	Act3SewerMagicShrine                 Name = 325
	Act3SewerDeadBody                    Name = 326
	Act3SewerTorch                       Name = 327
	Act3KurastTorch                      Name = 328
	MafistoLargeChestLeft                Name = 329
	MafistoLargeChestRight               Name = 330
	MafistoMediumChestLeft               Name = 331
	MafistoMediumChestRight              Name = 332
	SpiderLairLargeChestLeft             Name = 333
	SpiderLairTallChestLeft              Name = 334
	SpiderLairMediumChestRight           Name = 335
	SpiderLairTallChestRight             Name = 336
	SteegStone                           Name = 337
	GuildVault                           Name = 338
	TrophyCase                           Name = 339
	MessageBoard                         Name = 340
	MephistoBridge                       Name = 341
	HellGate                             Name = 342
	Act3KurastManaWell                   Name = 343
	Act3KurastHealthWell                 Name = 344
	HellFire1                            Name = 345
	HellFire2                            Name = 346
	HellFire3                            Name = 347
	HellLava1                            Name = 348
	HellLava2                            Name = 349
	HellLava3                            Name = 350
	HellLightSource1                     Name = 351
	HellLightSource2                     Name = 352
	HellLightSource3                     Name = 353
	HoradricCubeChest                    Name = 354
	HoradricScrollChest                  Name = 355
	StaffOfKingsChest                    Name = 356
	YetAnotherTome                       Name = 357
	HellBrazier1                         Name = 358
	HellBrazier2                         Name = 359
	DungeonRockPile                      Name = 360
	Act3DungeonMagicShrine               Name = 361
	Act3DungeonBasket                    Name = 362
	OuterHellHungSkeleton                Name = 363
	GuyForDungeon                        Name = 364
	Act3DungeonCasket                    Name = 365
	Act3SewerStairs                      Name = 366
	Act3SewerStairsToLevel3              Name = 367
	DarkWandererStartPosition            Name = 368
	TrappedSoulPlaceHolder               Name = 369
	Act3TownTorch                        Name = 370
	LargeChestR                          Name = 371
	InnerHellBoneChest                   Name = 372
	HellSkeletonSpawnNE                  Name = 373
	Act3WaterFog                         Name = 374
	DummyNotUsed                         Name = 375
	HellForge                            Name = 376
	GuildPortal                          Name = 377
	HratliStartPosition                  Name = 378
	HratliEndPosition                    Name = 379
	BurningTrappedSoul1                  Name = 380
	BurningTrappedSoul2                  Name = 381
	NatalyaStartPosition                 Name = 382
	StuckedTrappedSoul1                  Name = 383
	StuckedTrappedSoul2                  Name = 384
	CainStartPosition                    Name = 385
	StairSR                              Name = 386
	ArcaneLargeChestLeft                 Name = 387
	ArcaneCasket                         Name = 388
	ArcaneLargeChestRight                Name = 389
	ArcaneSmallChestLeft                 Name = 390
	ArcaneSmallChestRight                Name = 391
	DiabloSeal1                          Name = 392 // Top right 1
	DiabloSeal2                          Name = 393 // Top right 2
	DiabloSeal3                          Name = 394 // Top middle
	DiabloSeal4                          Name = 395 // Top left 1
	DiabloSeal5                          Name = 396 // Top left 2
	SparklyChest                         Name = 397
	PandamoniumFortressWaypoint          Name = 398
	InnerHellFissure                     Name = 399
	HellMesaBrazier                      Name = 400
	Smoke                                Name = 401
	ValleyWaypoint                       Name = 402
	HellBrazier3                         Name = 403
	CompellingOrb                        Name = 404
	KhalimChest1                         Name = 405
	KhalimChest2                         Name = 406
	KhalimChest3                         Name = 407
	SiegeMachineControl                  Name = 408
	PotOTorch                            Name = 409
	PyoxFirePit                          Name = 410
	ExpansionChestRight                  Name = 413
	ExpansionWildernessShrine1           Name = 414
	ExpansionWildernessShrine2           Name = 415
	ExpansionHiddenStash                 Name = 416
	ExpansionWildernessFlag              Name = 417
	ExpansionWildernessBarrel            Name = 418
	ExpansionSiegeBarrel                 Name = 419
	ExpansionWoodChestLeft               Name = 420
	ExpansionWildernessShrine3           Name = 421
	ExpansionManaShrine                  Name = 422
	ExpansionHealthShrine                Name = 423
	BurialChestLeft                      Name = 424
	BurialChestRight                     Name = 425
	ExpansionWell                        Name = 426
	ExpansionWildernessShrine4           Name = 427
	ExpansionWildernessShrine5           Name = 428
	ExpansionWaypoint                    Name = 429
	ExpansionChestLeft                   Name = 430
	ExpansionWoodChestRight              Name = 431
	ExpansionSmallChestLeft              Name = 432
	ExpansionSmallChestRight             Name = 433
	ExpansionTorch1                      Name = 434
	ExpansionCampFire                    Name = 435
	ExpansionTownTorch                   Name = 436
	ExpansionTorch2                      Name = 437
	ExpansionBurningBodies               Name = 438
	ExpansionBurningPit                  Name = 439
	ExpansionTribalFlag                  Name = 440
	ExpansionTownFlag                    Name = 441
	ExpansionChandelier                  Name = 442
	ExpansionJar1                        Name = 443
	ExpansionJar2                        Name = 444
	ExpansionJar3                        Name = 445
	ExpansionSwingingHeads               Name = 446
	ExpansionWildernessPole              Name = 447
	AnimatedSkullAndRockPile             Name = 448
	ExpansionTownGate                    Name = 449
	SkullAndRockPile                     Name = 450
	SiegeHellGate                        Name = 451
	EnemyCampBanner1                     Name = 452
	EnemyCampBanner2                     Name = 453
	ExpansionExplodingChest              Name = 454
	ExpansionSpecialChest                Name = 455
	ExpansionDeathPole                   Name = 456
	ExpansionDeathPoleLeft               Name = 457
	TempleAltar                          Name = 458
	DrehyaTownStartPosition              Name = 459
	DrehyaWildernessStartPosition        Name = 460
	NihlathakTownStartPosition           Name = 461
	NihlathakWildernessStartPositionName Name = 462
	IceCaveHiddenStash                   Name = 463
	IceCaveHealthShrine                  Name = 464
	IceCaveManaShrine                    Name = 465
	IceCaveEvilUrn                       Name = 466
	IceCaveJar1                          Name = 467
	IceCaveJar2                          Name = 468
	IceCaveJar3                          Name = 469
	IceCaveJar4                          Name = 470
	IceCaveJar5                          Name = 471
	IceCaveMagicShrine                   Name = 472
	CagedWussie                          Name = 473
	AncientStatue3                       Name = 474
	AncientStatue1                       Name = 475
	AncientStatue2                       Name = 476
	DeadBarbarian                        Name = 477
	ClientSmoke                          Name = 478
	IceCaveMagicShrine2                  Name = 479
	IceCaveTorch1                        Name = 480
	IceCaveTorch2                        Name = 481
	ExpansionTikiTorch                   Name = 482
	WorldstoneManaShrine                 Name = 483
	WorldstoneHealthShrine               Name = 484
	WorldstoneTomb1                      Name = 485
	WorldstoneTomb2                      Name = 486
	WorldstoneTomb3                      Name = 487
	WorldstoneMagicShrine                Name = 488
	WorldstoneTorch1                     Name = 489
	WorldstoneTorch2                     Name = 490
	ExpansionSnowyManaShrine1            Name = 491
	ExpansionSnowyHealthShrine           Name = 492
	ExpansionSnowyWell                   Name = 493
	WorldstoneWaypoint                   Name = 494
	ExpansionSnowyMagicShrine2           Name = 495
	ExpansionWildernessWaypoint          Name = 496
	ExpansionSnowyMagicShrine3           Name = 497
	WorldstoneWell                       Name = 498
	WorldstoneMagicShrine2               Name = 499
	ExpansionSnowyObject1                Name = 500
	ExpansionSnowyWoodChestLeft          Name = 501
	ExpansionSnowyWoodChestRight         Name = 502
	WorldstoneMagicShrine3               Name = 503
	ExpansionSnowyWoodChest2Left         Name = 504
	ExpansionSnowyWoodChest2Right        Name = 505
	SnowySwingingHeads                   Name = 506
	SnowyDebris                          Name = 507
	PenBreakableDoor                     Name = 508
	ExpansionTempleMagicShrine1          Name = 509
	ExpansionSnowyPoleMR                 Name = 510
	IceCaveWaypoint                      Name = 511
	ExpansionTempleMagicShrine2          Name = 512
	ExpansionTempleWell                  Name = 513
	ExpansionTempleTorch1                Name = 514
	ExpansionTempleTorch2                Name = 515
	ExpansionTempleObject1               Name = 516
	ExpansionTempleObject2               Name = 517
	WorldstoneMrBox                      Name = 518
	IceCaveWell                          Name = 519
	ExpansionTempleMagicShrine           Name = 520
	ExpansionTempleHealthShrine          Name = 521
	ExpansionTempleManaShrine            Name = 522
	BlacksmithForge                      Name = 523
	WorldstoneTomb1Left                  Name = 524
	WorldstoneTomb2Left                  Name = 525
	WorldstoneTomb3Left                  Name = 526
	IceCaveBubblesU                      Name = 527
	IceCaveBubblesS                      Name = 528
	RedBaalsLairTomb1                    Name = 529
	RedBaalsLairTomb1Left                Name = 530
	RedBaalsLairTomb2                    Name = 531
	RedBaalsLairTomb2Left                Name = 532
	RedBaalsLairTomb3                    Name = 533
	RedBaalsLairTomb3Left                Name = 534
	RedBaalsLairMrBox                    Name = 535
	RedBaalsLairTorch1                   Name = 536
	RedBaalsLairTorch2                   Name = 537
	CandlesTemple                        Name = 538
	TempleWaypoint                       Name = 539
	ExpansionDeadPerson1                 Name = 540
	TempleGroundTomb                     Name = 541
	LarzukGreeting                       Name = 542
	LarzukStandard                       Name = 543
	TempleGroundTombLeft                 Name = 544
	ExpansionDeadPerson2                 Name = 545
	AncientsAltar                        Name = 546
	ArreatSummitDoorToWorldstone         Name = 547
	ExpansionWeaponRackRight             Name = 548
	ExpansionWeaponRackLeft              Name = 549
	ExpansionArmorStandRight             Name = 550
	ExpansionArmorStandLeft              Name = 551
	ArreatsSummitTorch2                  Name = 552
	ExpansionFuneralSpire                Name = 553
	ExpansionBurningLogs                 Name = 554
	IceCaveSteam                         Name = 555
	ExpansionDeadPerson3                 Name = 556
	BaalsLair                            Name = 557
	FrozenAnya                           Name = 558
	BBQBunny                             Name = 559
	BaalTorchBig                         Name = 560
	InvisibleAncient                     Name = 561
	InvisibleBase                        Name = 562
	BaalsPortal                          Name = 563
	ArreatSummitDoor                     Name = 564
	LastPortal                           Name = 565
	LastLastPortal                       Name = 566
	ZooTestData                          Name = 567
	KeeperTestData                       Name = 568
	BaalsPortal2                         Name = 569
	FirePlaceGuy                         Name = 570
	DoorBlocker1                         Name = 571
	DoorBlocker2                         Name = 572

	// Added manually
	GoodChest          Name = 580
	NotSoGoodChestName      = 581
)
