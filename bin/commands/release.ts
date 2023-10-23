import {
  CliffyCommand,
  formatDate,
  groupBy,
  Mustache,
  nodeEmoji,
  packageJson,
  semver,
  z,
} from "../deps.ts";
import config from "@modules/config/mod.ts";
import { executeCommand, logger } from "./_utils.ts";

const commitFormat = {
  hash: "%H",
  id: "%h",
  subject: "%s",
  timestamp: "%cI",
  ref: "%D",
};

const defaultEmojiGroup = {
  group: "misc",
  label: "Miscellaneous" as const,
  emojis: [] as string[],
};

const emojiMap = [
  {
    group: "added",
    label: "Added" as const,
    emojis: [
      "sparkles",
      "tada",
      "white_check_mark",
      "construction_worker",
      "chart_with_upwards_trend",
      "heavy_plus_sign",
      "loud_sound",
    ],
  },
  {
    group: "changed",
    label: "Changed" as const,
    emojis: [
      "art",
      "zap",
      "lipstick",
      "rotating_light",
      "arrow_down",
      "arrow_up",
      "pushpin",
      "recycle",
      "wrench",
      "rewind",
      "alien",
      "truck",
      "bento",
      "wheelchair",
      "speech_balloon",
      "card_file_box",
      "children_crossing",
      "building_construction",
      "iphone",
    ],
  },
  {
    group: "breaking_changes",
    label: "Breaking changes" as const,
    emojis: ["boom"],
  },
  {
    group: "deprecated",
    label: "Deprecated" as const,
    emojis: ["wastebasket"],
  },
  {
    group: "removed",
    label: "Removed" as const,
    emojis: ["fire", "heavy_minus_sign", "mute"],
  },
  {
    group: "fixed",
    label: "Fixed" as const,
    emojis: [
      "bug",
      "ambulance",
      "apple",
      "penguin",
      "checkered_flag",
      "robot",
      "green_apple",
      "green_heart",
      "pencil2",
    ],
  },
  {
    group: "security",
    label: "Security" as const,
    emojis: ["lock"],
  },
  {
    group: "release",
    label: "Release" as const,
    emojis: ["bookmark"],
  },
];

const commitSchema = z
  .object({
    hash: z.string(),
    id: z.string(),
    subject: z.string(),
    timestamp: z.coerce.date(),
    ref: z.string(),
  })
  .transform(transformCommit);

const commitsSchema = z.array(commitSchema);

const template = Deno.readTextFileSync("./bin/templates/release.mustache");

const ReleaseCommand = new CliffyCommand.Command()
  .name("release")
  .description("Release a new version of the project.")
  .option("-M, --major", "Release a major version.", {
    conflicts: ["minor", "patch"],
    required: true,
  })
  .option("-m, --minor", "Release a minor version.", {
    conflicts: ["major", "patch"],
    required: true,
  })
  .option("-p, --patch", "Release a patch version", {
    conflicts: ["minor", "major"],
    required: true,
  })
  .option(
    "-n, --dry-run [dry-run:boolean]",
    "Print the release notes without actually making a new release.",
    { default: false },
  )
  .action(function main(options) {
    const current = getVersionObject(config.VERSION);
    const type = getReleaseType(options);
    const next = getVersionObject(semver.increment(current.semver, type));
    const commits = retrieveCommits();
    const release = {
      version: next.version,
      date: formatDate(new Date(), "yyyy-MM-dd"),
      tag: next.tag,
      groups: Object.entries(associateCommits(commits)).map(
        ([kind, commits]) => ({ kind, commits }),
      ),
    };

    const notes = Mustache.render(template, release);

    if (!options.dryRun) {
      updatePackageJson(release.version);
      createGitTag(release.tag, notes);
    } else {
      console.info(Deno.inspect(notes, { strAbbreviateSize: Infinity }));
    }
  });

if (import.meta.main) {
  ReleaseCommand.parse(Deno.args);
}

export default ReleaseCommand;

function getVersionObject(version: string | semver.SemVer) {
  if (typeof version === "string") {
    return {
      version,
      tag: `v${version}`,
      semver: semver.parse(version),
    };
  }

  const formatted = semver.format(version);

  return {
    version: formatted,
    tag: `v${formatted}`,
    semver: version,
  };
}

function getReleaseType(options: CommandOptions) {
  return Object.keys(options)[0] as semver.ReleaseType;
}

function retrieveCommits() {
  const output = executeCommand("git", {
    args: ["log", `--pretty=format:${JSON.stringify(commitFormat)}`],
  });

  const allCommits = commitsSchema
    .parse(JSON.parse(`[${output.split("\n").join(",")}]`))
    .sort(sortByDate)
    .toReversed();

  const commits: Commit[] = [];

  for (let i = 0; i < allCommits.length; i++) {
    const commit = allCommits[i];

    if (commit.group === "Release") {
      return commits;
    }

    commits.push(commit);
  }

  return commits;
}

function updatePackageJson(version: string) {
  const newPackageJson = structuredClone(packageJson);

  newPackageJson.version = version;

  const content = JSON.stringify(newPackageJson, null, 2) + "\n";

  Deno.writeTextFileSync("./package.json", content);

  executeCommand("git", { args: ["add", "package.json"] });
  executeCommand("git", {
    args: ["commit", "-m", `:bookmark: Release v${version}`],
  });
}

function createGitTag(tag: string, notes: string) {
  executeCommand("git", {
    args: ["tag", "-a", tag, "-m", `${tag}\n\n${notes}`],
  });

  logger.info(`Tag ${tag} created!`);

  executeCommand("git", { args: ["push", "--follow-tags"] });

  logger.info(`Code pushed to Github!`);

  executeCommand("gh", {
    args: ["release", "create", tag, "--notes-from-tag"],
  });

  logger.info(`Release created ✨`);
}

function associateCommits(commits: Commit[]) {
  return groupBy(commits, (commit) => commit.group);
}

function transformCommit(rawCommit: RawCommit) {
  const emojiMatch = rawCommit.subject.match(/:\w+:/);

  if (emojiMatch === null) {
    throw new Error("No emoji found :(", { cause: { rawCommit } });
  }

  const emoji = emojiMatch[0];

  return {
    ...rawCommit,
    subject: replaceWithEmoji(rawCommit.subject, emoji),
    emoji,
    group: findCommitGroup(emoji.replaceAll(":", "")).label,
  };
}

function findCommitGroup(emoji: string) {
  for (let i = 0; i < emojiMap.length; i++) {
    const group = emojiMap[i];

    if (group.emojis.includes(emoji)) {
      return group;
    }
  }

  return defaultEmojiGroup;
}

function replaceWithEmoji(subject: string, emoji: string) {
  if (emoji === "construction_worker") {
    emoji = "construction_worker_woman";
  }

  const emojiSymbol = nodeEmoji.get(emoji);

  if (!emojiSymbol) {
    return subject;
  }

  return subject.replace(emoji, emojiSymbol);
}

function sortByDate(commit1: Commit, commit2: Commit) {
  return commit1.timestamp.getTime() - commit2.timestamp.getTime();
}

type RawCommit = {
  hash: string;
  id: string;
  subject: string;
  timestamp: Date;
};

type Commit = z.output<typeof commitSchema>;

type CommitGroup = (typeof emojiMap)[number]["label"];

type CommandOptions = {
  major?: boolean;
  minor?: boolean;
  patch?: boolean;
};
